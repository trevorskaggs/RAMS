from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Case, BooleanField, Prefetch, Value, When, Exists
from copy import deepcopy
from rest_framework import filters, viewsets
from actstream import action

from people.models import Person
from animals.models import Animal, AnimalImage
from animals.serializers import AnimalSerializer

class AnimalViewSet(viewsets.ModelViewSet):

    queryset = Animal.objects.all().prefetch_related(Prefetch('animalimage_set', to_attr='images')).order_by('order')

    search_fields = ['name', 'species', 'status', 'request__address', 'request__city', 'owner__first_name', 'owner__last_name', 'owner__address', 'owner__city']
    filter_backends = (filters.SearchFilter,)
    serializer_class = AnimalSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():

            # Set status to SHELTERED if a shelter is added.
            if serializer.validated_data.get('shelter'):
                serializer.validated_data['status'] = 'SHELTERED'

            # Set room to null if not present, or if status is changed to REUNITED
            if not serializer.validated_data.get('room'):
                serializer.validated_data['room'] = None

            animal = serializer.save()
            animals = [animal]
            action.send(self.request.user, verb='created animal', target=animal)

            # Create multiple copies of animal if specified.
            for i in range(int(self.request.data.get('number_of_animals', 1)) -1):
                new_animal = deepcopy(animal)
                new_animal.id = None
                new_animal.save()
                animals.append(new_animal)

            for animal in animals:
                # Add Owner to new animals if it is POSTed.
                if self.request.data.get('new_owner'):
                    animal.owner.add(self.request.data['new_owner'])

                # Add ServiceRequest Owner and Reporter to new animals being added to an SR.
                if serializer.validated_data.get('request'):
                    animal.owner.add(*animal.request.owner.all())

                if animal.room:
                    action.send(self.request.user, verb='sheltered animal', target=animal.room, action_object=animal)
                    action.send(self.request.user, verb='sheltered animal', target=animal.room.building, action_object=animal)
                    action.send(self.request.user, verb='sheltered animal', target=animal.room.building.shelter, action_object=animal)

                images_data = self.request.FILES
                for key, image_data in images_data.items():
                    # Strip out extra numbers from the key (e.g. "extra1" -> "extra")
                    category = key.translate({ord(num): None for num in '0123456789'})
                    # Create image object.
                    AnimalImage.objects.create(image=image_data, animal=animal, category=category)

    def perform_update(self, serializer):
        if serializer.is_valid():

            # Keep owner the same when editing an animal.
            serializer.validated_data['owner'] = serializer.instance.owner.values_list('id', flat=True)

            # Mark as SHELTERED if we receive shelter field and it's not already in a shelter.
            if serializer.validated_data.get('shelter') and not serializer.instance.shelter:
                serializer.validated_data['status'] = 'SHELTERED'
                action.send(self.request.user, verb='sheltered animal', target=serializer.validated_data.get('shelter'), action_object=serializer.instance)

            # If animal had a room and now doesn't or has a different room.
            if serializer.instance.room and (not serializer.validated_data.get('room') or serializer.instance.room != serializer.validated_data.get('room')):
                action.send(self.request.user, verb='removed animal', target=serializer.instance.room, action_object=serializer.instance)
                action.send(self.request.user, verb='removed animal', target=serializer.instance.room.building, action_object=serializer.instance)
                # action.send(self.request.user, verb='removed animal', target=serializer.instance.room.building.shelter, action_object=serializer.instance)

            # If animal is added to a new room from no room or a different room.
            if serializer.validated_data.get('room') and (serializer.instance.room != serializer.validated_data.get('room')):
                action.send(self.request.user, verb='roomed animal', target=serializer.validated_data.get('room'), action_object=serializer.instance)
                action.send(self.request.user, verb='roomed animal', target=serializer.validated_data.get('room').building, action_object=serializer.instance)

            # Record status change if appplicable.
            if serializer.instance.status != serializer.validated_data.get('status', serializer.instance.status):
                new_status = serializer.validated_data.get('status')
                action.send(self.request.user, verb=f'changed animal status to {new_status}', target=serializer.instance)

            # Identify if there were any animal changes that aren't status, shelter, room, or owner.
            changed_fields = []
            for field, value in serializer.validated_data.items():
                new_value = value
                old_value = getattr(serializer.instance, field)
                if field not in ['status', 'room', 'shelter', 'order', 'owner'] and new_value != old_value:
                    changed_fields.append(field)

            animal = serializer.save()

            # Set order if present, add 1 to avoid 0 index since order is a PositiveIntergerField.
            if type(self.request.data.get('set_order', '')) == int:
                animal.to(int(self.request.data.get('set_order'))+1)

            # Only record animal update if a field other than status, shelter, room, order, or owner has changed.
            if len(changed_fields) > 0:
                action.send(self.request.user, verb='updated animal', target=animal)

            # Remove Owner from animal.
            if self.request.data.get('remove_owner'):
                animal.owner.remove(self.request.data.get('remove_owner'))

            old_images = serializer.data['extra_images']
            updated_images = self.request.data['extra_images'].split(',') if self.request.data.get('extra_images', None) else []
            # Compare old vs updated extra images to identify ones that have been removed and should be deleted.
            # Strip out MEDIA_URL so that we can compare to image filename using a filter().
            images_to_delete = [image_to_delete.replace(settings.MEDIA_URL, '') for image_to_delete in set(old_images) - set(updated_images)]
            AnimalImage.objects.filter(animal=animal, category="extra", image__in=images_to_delete).delete()
            for key in ['front_image', 'side_image']:
                if serializer.data.get(key, '') != self.request.data.get(key, ''):
                    try:
                        AnimalImage.objects.get(animal=animal, category=key).delete()
                    except ObjectDoesNotExist:
                        pass

            # Only brand new files should show up in request.FILES.
            images_data = self.request.FILES
            for key, image_data in images_data.items():
                # If we have a new front or side image, delete the old one and create a new one.
                if key in ("front_image", "side_image"):
                    AnimalImage.objects.create(image=image_data, animal=animal, category=key)
                # Otherwise create a new extra image.
                else:
                    AnimalImage.objects.create(image=image_data, animal=animal, category="extra")
    
    def get_queryset(self):
        """
        Returns: Queryset of distinct animals, each annotated with:
            is_stray (boolean)
            images (List of AnimalImages)
        and filtered by is_stray.   
        """        
        queryset = Animal.objects.all().annotate(
            is_stray=Case(
                When(owner=None, then=True),
                default=False,
                output_field=BooleanField(),
            )
        ).prefetch_related(Prefetch('animalimage_set', to_attr='images')).distinct()
        
        #filter by is_stray
        is_stray = self.request.query_params.get('is_stray', '')
        if is_stray == 'true':
            queryset = queryset.filter(is_stray=True)
        elif is_stray == 'false':
            queryset = queryset.filter(is_stray=False)
            
        return queryset
    
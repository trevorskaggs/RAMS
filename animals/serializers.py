from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from actstream.models import target_stream

from .models import Animal, AnimalImage
from location.utils import build_full_address, build_action_string

class SimpleAnimalSerializer(serializers.ModelSerializer):
    full_address = serializers.SerializerMethodField()
    request_address = serializers.SerializerMethodField()
    aco_required = serializers.SerializerMethodField()
    front_image = serializers.SerializerMethodField()
    side_image = serializers.SerializerMethodField()
    extra_images = serializers.SerializerMethodField()
    shelter_name = serializers.SerializerMethodField()
    shelter = serializers.SerializerMethodField()
    is_stray = serializers.BooleanField(read_only=True)

    # Custom Evac Assignment field to avoid a circular reference.
    def get_evacuation_assignments(self, obj):
        return obj.evacuation_assignments.values_list('id', flat=True)

    # Custom field for the full address.
    def get_full_address(self, obj):
        # Use the Room address first if it exists.
        if obj.room:
            return build_full_address(obj.room.building.shelter)
        # Then use the SR address if it exists.
        elif obj.request:
            return build_full_address(obj.request)
        # Otherwise return an empty string.
        return ''

    # Custome field for request address.
    def get_request_address(self, obj):
        return build_full_address(obj.request)

    # Custom field to return shelter ID.
    def get_shelter(self, obj):
        if obj.room:
            return obj.room.building.shelter.id
        return None

    # Custom field to return the shelter name.
    def get_shelter_name(self, obj):
        if obj.room:
            return obj.room.building.shelter.name
        return ''

    # An Animal is ACO Required if it is aggressive or "Other" species.
    def get_aco_required(self, obj):
        return (obj.aggressive or obj.species.other)

    def get_action_history(self, obj):
        return [build_action_string(action) for action in target_stream(obj)]

    def get_front_image(self, obj):
        try:
            return [animal_image.image.url for animal_image in obj.images if animal_image.category == 'front_image'][0]
            # change this exception
        except IndexError:
            return ''
        except AttributeError:
            # Should only hit this when returning a single object after create.
            try:
                return obj.animalimage_set.filter(category='front_image').first().url
            except AttributeError:
                return ''

    def get_side_image(self, obj):
        try:
            return [animal_image.image.url for animal_image in obj.images if animal_image.category == 'side_image'][0]
        except IndexError:
            return ''
        except AttributeError:
            try:
                return obj.animalimage_set.filter(category='side_image').first().url
            except AttributeError:
                return ''


    def get_extra_images(self, obj):
        try:
            return [animal_image.image.url for animal_image in obj.images if animal_image.category == 'extra'][0]
        except IndexError:
            return ''
        except AttributeError:
            # Should only hit this when returning a single object after create.
            try:
                return obj.animalimage_set.filter(category='extra').first().url
            except AttributeError:
                return ''

    class Meta:
        model = Animal
        exclude = ['owner']

class AnimalSerializer(SimpleAnimalSerializer):
    owners = serializers.SerializerMethodField()
    action_history = serializers.SerializerMethodField()

    # Custom Owner object field that excludes animals to avoid a circular reference.
    def get_owners(self, obj):
        from people.serializers import SimplePersonSerializer
        if obj.owner.exists():
            return SimplePersonSerializer(obj.owner, many=True).data
        return []
    
    class Meta:
        model = Animal
        fields = '__all__'
    



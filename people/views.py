from rest_framework import permissions, viewsets
from actstream import action

from hotline.models import ServiceRequest
from people.models import Person
from people.serializers import PersonSerializer


# Provides view for Person API calls.
class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = PersonSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():
            person = serializer.save()
            action.send(self.request.user, verb='created person', target=person)

            # If an owner is being added to an existing SR, add the owner to the SR and update all SR animals with the owner.
            if self.request.data.get('request'):
                service_request = ServiceRequest.objects.get(pk=self.request.data.get('request'))
                service_request.owner.add(person)
                for animal in service_request.animal_set.all():
                    animal.owner.add(person)

    def perform_update(self, serializer):
        if serializer.is_valid():
            person = serializer.save()
            action.send(self.request.user, verb='updated person', target=person)

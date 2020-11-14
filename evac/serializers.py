import re

from rest_framework import serializers
from actstream.models import target_stream

from evac.models import EvacAssignment, EvacTeamMember, VisitNote
from hotline.serializers import ServiceRequestSerializer
from location.utils import build_action_string

class EvacTeamMemberSerializer(serializers.ModelSerializer):
    
    display_name = serializers.SerializerMethodField()
    display_phone = serializers.SerializerMethodField()

    # Custome field for Name Output
    def get_display_name(self, obj):
        return '%s, %s' % (obj.last_name, obj.first_name)

    # Custom field for Formated Phone Number
    def get_display_phone(self, obj):
        return re.sub(r'(\d{3})(\d{3})(\d{4})', r'(\1) \2-\3', obj.phone)

    class Meta:
        model = EvacTeamMember
        fields = '__all__'

class EvacAssignmentSerializer(serializers.ModelSerializer):
    action_history = serializers.SerializerMethodField()

    def get_action_history(self, obj):
        return [build_action_string(action).replace(f'EvacAssignment object ({obj.id})', '') for action in target_stream(obj)]

    team_member_objects = EvacTeamMemberSerializer(source='team_members', required=False, read_only=True, many=True)
    service_request_objects = ServiceRequestSerializer(source='service_requests', required=False, read_only=True, many=True)

    class Meta:
        model = EvacAssignment
        fields = '__all__'

class VisitNoteSerializer(serializers.ModelSerializer):

    address = serializers.SerializerMethodField()
    
    def get_address(self, obj):
        return obj.service_request.location_output

    class Meta:
        model = VisitNote
        fields = '__all__'


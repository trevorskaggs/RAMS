from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from evac import views

app_name = 'evac'
router = DefaultRouter()
router.register(r'evacteam', views.EvacTeamViewSet)

urlpatterns = [
    path('', views.evac_landing, name ='evac_landing'),
    path('api/', include(router.urls)),
    path('teammember/new', views.team_member, name='new_team_member'),
    path('teammember/<int:pk>', views.team_member, name='edit_team_member'),
    path('evacteam/new', views.evac_team, name='new_evac_team'),
    path('evacteam/<int:pk>', views.evac_team, name='edit_evac_team'),
    path('evacteam/list', views.current_evac_team_list, name='current_evac_team_list'),
]
from django.contrib import admin
from django.urls import include, path, re_path

from hotline import views
from rest_framework.routers import DefaultRouter

from hotline.views import ServiceRequestViewSet


app_name = 'hotline'
router = DefaultRouter()
router.register(r'servicerequests', views.ServiceRequestViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

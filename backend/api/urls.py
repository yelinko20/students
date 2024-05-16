from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views  
router = DefaultRouter()
router.register('students', views.StudentViewSet, basename='students')
router.register('studentdetails', views.StudentDetailsViewSet, basename='studentdetails')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views  # Assuming your views.py is in the same directory as this file

router = DefaultRouter()
router.register('students', views.StudentViewSet, basename='students')
router.register('studentdetails', views.StudentDetailsViewSet, basename='studentdetails')

urlpatterns = [
    path('', include(router.urls)),
    path('export-excel/', views.ExportExcelView.as_view(), name='export_excel'),
]

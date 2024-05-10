from django.http import HttpResponse
from rest_framework import viewsets, status, filters, views
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Student, StudentDetails
from .serializers import StudentSerializer, StudentDetailsSerializer
from django.db.models import F 
import pandas as pd
import os
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.prefetch_related('details').order_by("student_id")  
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'student_id']

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        student = self.get_object()
        serializer = self.get_serializer(student)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    
    def update(self, request, pk=None):
        student = self.get_object()
        serializer = self.get_serializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def partial_update(self, request, pk=None):
        student = self.get_object()
        serializer = self.get_serializer(student, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        student = self.get_object()
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StudentDetailsViewSet(viewsets.ModelViewSet):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer

    def list(self, request):
        details = self.get_queryset()
        serializer = self.get_serializer(details, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        detail = self.get_object()
        serializer = self.get_serializer(detail)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            raise ValidationError({'error': 'Student with provided ID does not exist'})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(student=student)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None):
        detail = self.get_object()
        serializer = self.get_serializer(detail, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        detail = self.get_object()
        serializer = self.get_serializer(detail, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        detail = self.get_object()
        detail.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExportExcelView(views.APIView):
    # Removed permission_classes

    def post(self, request):
        try:
            # Fetch student data with related details using select_related
            students = Student.objects.select_related('details').all().values(
                'student_id', 'name', 'phone', 'email', 'date_of_birth', 'address', 'township', 'NRC',
                details__year=F('details__year'),
                details__mark1=F('details__mark1'),
                details__mark2=F('details__mark2'),
                details__mark3=F('details__mark3'),
                details__total_marks=F('details__total_marks'),
            )

            # Convert to pandas DataFrame and exclude unnecessary fields (id)
            df = pd.DataFrame(students)
            df.drop(columns=['id'], inplace=True)

            # Handle potential file existence & overwrite (optional)
            if os.path.exists("Student_Details.xlsx"):  # Changed filename to avoid overwrite
                overwrite_confirmation = request.POST.get('overwrite', False)
                if not overwrite_confirmation:
                    return Response({
                        "status": False,
                        "message": "File 'Student_Details.xlsx' already exists. Please confirm overwrite or choose a different filename."
                    }, status=status.HTTP_409_CONFLICT)

            # Create the Excel file with appropriate headers and formatting (optional)
            writer = pd.ExcelWriter("Student_Details.xlsx", engine='xlsxwriter')
            df.to_excel(writer, sheet_name='Students_with_Details', index=False)  # Customize sheet name

            # Add headers, formatting, or other customizations using workbook/worksheet objects (optional)
            # ... (your Excel formatting logic here)

            writer.save()

            return HttpResponse(writer.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

        except Exception as e:
            return Response({
                "status": False,
                "message": "An error occurred during export: " + str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.http import HttpResponse
from rest_framework import viewsets, status, filters, views
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Student, StudentDetails
from .serializers import StudentSerializer, StudentDetailsSerializer
import xlwt

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
    def get(self, request, *args, **kwargs):
        students = Student.objects.all()
        
        # Serialize the data
        student_serializer = StudentSerializer(students, many=True)
        student_data = student_serializer.data
        print(student_data)
        
        student_details_data = []
        for student in students:
            details = student.details.all()
            details_serializer = StudentDetailsSerializer(details, many=True)
            student_details_data.extend(details_serializer.data)
        
        # Create Excel file
        # response = HttpResponse(content_type='application/ms-excel')
        # response['Content-Disposition'] = 'attachment; filename="exported_data.xls"'
        
        # workbook = xlwt.Workbook()
        # student_sheet = workbook.add_sheet('Students')
        # student_details_sheet = workbook.add_sheet('Student Details')
        
        # # Write headers for Students sheet
        # student_headers = list(student_data[0].keys())
        # for col, header in enumerate(student_headers):
        #     student_sheet.write(0, col, header)
        
        # # Write data rows for Students sheet
        # for row, item in enumerate(student_data, start=1):
        #     for col, value in enumerate(item.values()):
        #         student_sheet.write(row, col, value)
        
        # # Write headers for Student Details sheet
        # student_details_headers = list(student_details_data[0].keys())
        # for col, header in enumerate(student_details_headers):
        #     student_details_sheet.write(0, col, header)
        
        # # Write data rows for Student Details sheet
        # for row, item in enumerate(student_details_data, start=1):
        #     for col, value in enumerate(item.values()):
        #         student_details_sheet.write(row, col, value)
        
        # workbook.save(response)
        # return response
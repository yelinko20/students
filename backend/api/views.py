# from rest_framework import viewsets, status, filters, views
# from rest_framework.response import Response
# from rest_framework.exceptions import ValidationError
# from .paginations import CustomPagination
# from .models import Student, StudentDetails
# from .serializers import StudentSerializer, StudentDetailsSerializer
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.db.models import F 
# import pandas as pd
# import os


# class StudentViewSet(viewsets.ModelViewSet):
#     queryset = Student.objects.prefetch_related('details').order_by("student_id")  
#     serializer_class = StudentSerializer
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['name', 'student_id']
#     parser_classes = (MultiPartParser, FormParser)
#     pagination_class = CustomPagination


#     def list(self, request):
#         # queryset = self.filter_queryset(self.get_queryset())
#         # serializer = self.get_serializer(queryset, many=True)
#         # return Response(serializer.data)
#         queryset = self.filter_queryset(self.get_queryset())
#         page = self.paginate_queryset(queryset)
#         if page is not None:
#             serializer = self.get_serializer(page, many=True)
#             return self.get_paginated_response(serializer.data)

#         serializer = self.get_serializer(queryset, many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, pk=None):
#         student = self.get_object()
#         serializer = self.get_serializer(student)
#         return Response(serializer.data)

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    
#     def update(self, request, pk=None):
#         student = self.get_object()
#         serializer = self.get_serializer(student, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)
    
#     def partial_update(self, request, pk=None):
#         student = self.get_object()
#         serializer = self.get_serializer(student, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def destroy(self, request, pk=None):
#         student = self.get_object()
#         student.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

# class StudentDetailsViewSet(viewsets.ModelViewSet):
#     queryset = StudentDetails.objects.all()
#     serializer_class = StudentDetailsSerializer

#     def list(self, request):
#         details = self.get_queryset()
#         serializer = self.get_serializer(details, many=True)
#         return Response(serializer.data)

#     def retrieve(self, request, pk=None):
#         detail = self.get_object()
#         serializer = self.get_serializer(detail)
#         return Response(serializer.data)

#     def create(self, request, *args, **kwargs):
#         student_id = request.data.get('student')
#         try:
#             student = Student.objects.get(pk=student_id)
#         except Student.DoesNotExist:
#             raise ValidationError({'error': 'Student with provided ID does not exist'})

#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save(student=student)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

#     def update(self, request, pk=None):
#         detail = self.get_object()
#         serializer = self.get_serializer(detail, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def partial_update(self, request, pk=None):
#         detail = self.get_object()
#         serializer = self.get_serializer(detail, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)

#     def destroy(self, request, pk=None):
#         detail = self.get_object()
#         detail.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .paginations import CustomPagination
from .models import Student, StudentDetails
from .serializers import StudentSerializer, StudentDetailsSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import F

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.prefetch_related('details').order_by("student_id")
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'student_id']
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = CustomPagination

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())

        # Check for the 'page' query parameter
        if 'page_size' in request.query_params:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

        # No pagination
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
        remove_image = request.data.get('remove_image', False)
        if remove_image:
            student.image = None
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
    filter_backends = [filters.SearchFilter]
    search_fields = ['year']  
    pagination_class = CustomPagination

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())

        # Check for the 'page' query parameter
        if 'page_size' in request.query_params:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

        # No pagination
        serializer = self.get_serializer(queryset, many=True)
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



# from rest_framework import viewsets, status, filters
# from rest_framework.response import Response
# from rest_framework.exceptions import ValidationError
# from .paginations import CustomPagination
# from .models import Student, StudentDetails
# from .serializers import StudentSerializer, StudentDetailsSerializer
# from rest_framework.parsers import MultiPartParser, FormParser
# from django.db.models import F

# class StudentViewSet(viewsets.ModelViewSet):
#     queryset = Student.objects.prefetch_related('details').order_by("student_id")
#     serializer_class = StudentSerializer
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['name', 'student_id']
#     parser_classes = (MultiPartParser, FormParser)
#     pagination_class = CustomPagination

#     def list(self, request):
#         queryset = self.filter_queryset(self.get_queryset())

#         # Check for the 'page' query parameter
#         if 'page_size' in request.query_params:
#             page = self.paginate_queryset(queryset)
#             if page is not None:
#                 serializer = self.get_serializer(page, many=True)
#                 return self.get_paginated_response(serializer.data)

#         # No pagination
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
#         remove_image = request.data.get('remove_image', False)
#         if remove_image:
#             student.image = None
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
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['year']  
#     pagination_class = CustomPagination

#     def list(self, request):
#         queryset = self.filter_queryset(self.get_queryset())

#         # Check for the 'page' query parameter
#         if 'page_size' in request.query_params:
#             page = self.paginate_queryset(queryset)
#             if page is not None:
#                 serializer = self.get_serializer(page, many=True)
#                 return self.get_paginated_response(serializer.data)

#         # No pagination
#         serializer = self.get_serializer(queryset, many=True)
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
from django.http import Http404

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.prefetch_related('details').order_by("student_id")
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'student_id']
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = CustomPagination

    def list(self, request):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            if 'page_size' in request.query_params:
                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            student = self.get_object()
            serializer = self.get_serializer(student)
            return Response(serializer.data)
        except Http404:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            student = self.get_object()
            remove_image = request.data.get('remove_image', False)
            if remove_image:
                student.image = None
            serializer = self.get_serializer(student, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Http404:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, pk=None):
        try:
            student = self.get_object()
            serializer = self.get_serializer(student, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Http404:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None):
        try:
            student = self.get_object()
            student.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentDetailsViewSet(viewsets.ModelViewSet):
    queryset = StudentDetails.objects.all()
    serializer_class = StudentDetailsSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['year']
    pagination_class = CustomPagination

    def list(self, request):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            if 'page_size' in request.query_params:
                page = self.paginate_queryset(queryset)
                if page is not None:
                    serializer = self.get_serializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            detail = self.get_object()
            serializer = self.get_serializer(detail)
            return Response(serializer.data)
        except Http404:
            return Response({'error': 'Student details not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            raise ValidationError({'error': 'Student with provided ID does not exist'})

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(student=student)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk=None):
        try:
            detail = self.get_object()
            serializer = self.get_serializer(detail, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Http404:
            return Response({'error': 'Student details not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self, request, pk=None):
        try:
            detail = self.get_object()
            serializer = self.get_serializer(detail, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Http404:
            return Response({'error': 'Student details not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None):
        try:
            detail = self.get_object()
            detail.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response({'error': 'Student details not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

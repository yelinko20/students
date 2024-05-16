from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    default_page_size = 5  

    def get_page_size(self, request):
        if self.page_size_query_param:
            try:
                return int(request.query_params.get(self.page_size_query_param, self.default_page_size))
            except (TypeError, ValueError):
                return self.default_page_size
        return self.default_page_size
    def get_paginated_response(self, data):
        return Response({
            'page_size': self.get_page_size(self.request),
            'total_count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page_number': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
        })

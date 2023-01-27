from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters

from farm_base.api.v1.filters import OwnerFilter
from farm_base.api.v1.serializers import (
    OwnerListCreateSerializer,
    OwnerDetailSerializer,
)
from farm_base.models import Owner


class OwnerListCreateView(generics.ListCreateAPIView):
    queryset = Owner.objects.filter(is_active=True)
    serializer_class = OwnerListCreateSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_class = OwnerFilter
    search_fields = ["name", "document"]


class OwnerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Owner.objects.filter(is_active=True)
    serializer_class = OwnerDetailSerializer

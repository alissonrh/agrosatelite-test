from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend


from farm_base.api.v1.filters import FarmFilter
from farm_base.api.v1.serializers import (
    FarmListSerializer,
    FarmCreateSerializer,
    FarmDetailSerializer,
)
from farm_base.models import Farm

#  Filtros adicionados


class FarmListCreateView(generics.ListCreateAPIView):
    queryset = Farm.objects.filter(is_active=True)
    serializer_class = FarmListSerializer
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_class = FarmFilter
    search_fields = [
        "name",
        "owner",
        "municipality",
        "state",
    ]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return FarmListSerializer
        else:
            return FarmCreateSerializer

    def perform_create(self, serializer):
        farm = serializer.save()
        area = float(farm.geometry.area)
        centroid = farm.geometry.centroid
        serializer.save(area=area, centroid=centroid)


class FarmRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Farm.objects.filter(is_active=True)
    serializer_class = FarmDetailSerializer

import re
from django_filters import BaseInFilter, NumberFilter, CharFilter, FilterSet
from farm_base.models import Farm


class NumberInFilter(BaseInFilter, NumberFilter):
    pass


class DocumentInFilter(CharFilter):
    def filter(self, qs, value):
        value = re.sub("[^0-9]", "", value)
        return super().filter(qs, value)


class FarmFilter(FilterSet):
    ids = NumberInFilter(field_name="id", lookup_expr="in")

    class Meta:
        model = Farm
        fields = ["ids", "name", "owner", "municipality", "state"]

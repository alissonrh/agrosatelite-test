import re

from django_filters import BaseInFilter, NumberFilter, CharFilter


class NumberInFilter(BaseInFilter, NumberFilter):
    pass


class DocumentInFilter(CharFilter):
    def filter(self, qs, value):
        value = re.sub("[^0-9]", "", value)
        return super().filter(qs, value)

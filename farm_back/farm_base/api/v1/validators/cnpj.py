import re

from django.utils.translation import gettext as _
from rest_framework import serializers


def cnpj_validator(value):
    patterns = [
        "(^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}$)",
        "^[0-9]{14}$",
    ]
    for p in patterns:
        if re.match(p, value):
            return

    message = _("Invalid CNPJ")
    raise serializers.ValidationError(message)

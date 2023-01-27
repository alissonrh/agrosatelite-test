import re
from rest_framework import serializers

from farm_base.api.v1.validators import cpf_validator, cnpj_validator
from farm_base.models import Owner


class OwnerListCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ["id", "name", "document", "document_type"]

    def validate(self, data):
        if data["document_type"] == Owner.CPF:
            cpf_validator(data["document"])
            data["document"] = re.sub("[^0-9]", "", data["document"])
        elif data["document_type"] == Owner.CNPJ:
            cnpj_validator(data["document"])
            data["document"] = re.sub("[^0-9]", "", data["document"])
        return data


class OwnerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ["id", "name", "document", "document_type"]
        read_only_fields = ["id", "document", "document_type"]

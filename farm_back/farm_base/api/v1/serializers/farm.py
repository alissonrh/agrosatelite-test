from django.contrib.gis.geos import GEOSGeometry
from osgeo import ogr
from rest_framework import serializers
from rest_framework_gis.fields import GeometryField

from farm_base.api.v1.serializers.owner import OwnerDetailSerializer
from farm_base.models import Farm


class FarmListSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(FarmListSerializer, self).__init__(*args, **kwargs)
        request = kwargs["context"]["request"]
        include_geometry = request.GET.get("include_geometry", "false")

        if include_geometry.lower() == "true":
            self.fields["geometry"] = GeometryField(read_only=True)

    class Meta:
        model = Farm
        #  added all filds od the model
        fields = [
            "id",
            "name",
            "centroid",
            "area",
            "municipality",
            "state",
            "owner",
        ]
        read_only_fields = ["id", "centroid", "area"]


class FarmCreateSerializer(serializers.ModelSerializer):
    def validate_geometry(self, data):
        if data.hasz:
            g = ogr.CreateGeometryFromWkt(data.wkt)
            g.Set3D(False)
            data = GEOSGeometry(g.ExportToWkt())
        return data

    class Meta:
        model = Farm
        fields = [
            "id",
            "name",
            "geometry",
            "centroid",
            "area",
            "municipality",
            "state",
            "owner",
        ]
        read_only_fields = ["id", "centroid", "area"]

    def validate(self, data):
        print("EEEEENNNNNTTTROUUU")
        owner = data.get("owner", None)
        municipality = data.get("municipality", None)
        state = data.get("state", None)
        name = data.get("name", None)

        if not owner:
            raise serializers.ValidationError("Farm must have an owner.")
        if not municipality:
            raise serializers.ValidationError("Farm must have a municipality.")
        if not state:
            raise serializers.ValidationError("Farm must have a state.")
        if not name:
            raise serializers.ValidationError("Farm must have a name.")

        return data


class FarmDetailSerializer(serializers.ModelSerializer):
    owner = OwnerDetailSerializer(read_only=True)

    class Meta:
        model = Farm
        fields = "__all__"
        read_only_fields = ["id", "centroid", "area"]

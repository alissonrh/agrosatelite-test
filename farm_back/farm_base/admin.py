from django.contrib import admin
from django.utils.translation import gettext as _

from farm_base.models import Owner, Farm

admin.site.site_header = _("Farm Project - Administration")
admin.site.site_title = _("Farm Project - Site Administration")
admin.site.index_title = _("Applications")


class OwnerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'document', 'document_type', 'is_active']
    list_filter = ['document_type', 'creation_date',
                   'last_modification_date', 'is_active']
    search_fields = ['name', 'document', '=id']


class FarmAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'municipality', 'state', 'owner',
                    'creation_date', 'last_modification_date',
                    'is_active']
    list_filter = ['creation_date', 'last_modification_date', 'is_active']
    search_fields = ['name', '=id']

    readonly_fields = ["centroid", "area"]


admin.site.register(Owner, OwnerAdmin)
admin.site.register(Farm, FarmAdmin)

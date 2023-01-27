# Generated by Django 2.2 on 2023-01-27 17:50

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Name')),
                ('document', models.CharField(max_length=255, verbose_name='Document')),
                ('document_type', models.CharField(choices=[('CPF', 'CPF'), ('CNPJ', 'CNPJ')], max_length=10, verbose_name='Document type')),
                ('creation_date', models.DateTimeField(auto_now_add=True, verbose_name='Creation date')),
                ('last_modification_date', models.DateTimeField(auto_now=True, verbose_name='Last modification date')),
                ('is_active', models.BooleanField(default=True, verbose_name='Is Active')),
            ],
            options={
                'verbose_name': 'Owner',
                'verbose_name_plural': 'Owners',
                'ordering': ['id'],
                'unique_together': {('document', 'document_type')},
            },
        ),
        migrations.CreateModel(
            name='Farm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, verbose_name='Name')),
                ('municipality', models.CharField(blank=True, max_length=255)),
                ('state', models.CharField(blank=True, max_length=255)),
                ('geometry', django.contrib.gis.db.models.fields.GeometryField(blank=True, null=True, srid=4326, verbose_name='Geometry')),
                ('area', models.FloatField(blank=True, null=True, verbose_name='Area')),
                ('centroid', django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326, verbose_name='Centroid')),
                ('creation_date', models.DateTimeField(auto_now_add=True, verbose_name='Creation date')),
                ('last_modification_date', models.DateTimeField(auto_now=True, verbose_name='Last modification date')),
                ('is_active', models.BooleanField(default=True, verbose_name='Is Active')),
                ('owner', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='farm_base.Owner')),
            ],
            options={
                'verbose_name': 'Farm',
                'verbose_name_plural': 'Farms',
                'ordering': ['id'],
            },
        ),
    ]

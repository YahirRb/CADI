# Generated by Django 5.1.1 on 2024-09-19 20:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clases', '0002_rename_id_paquete_paquete_idpaquete_and_more'),
        ('pagos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pago',
            name='idClase',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='clases.clase'),
        ),
    ]

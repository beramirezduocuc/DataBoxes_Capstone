# Generated by Django 5.0.3 on 2024-10-14 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_alter_clienteusuario_fecha_expiracion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clienteusuario',
            name='telefono',
            field=models.IntegerField(null=True),
        ),
    ]

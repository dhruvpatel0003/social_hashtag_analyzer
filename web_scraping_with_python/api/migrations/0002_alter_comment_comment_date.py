# Generated by Django 5.0.1 on 2024-01-19 06:07

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='comment_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
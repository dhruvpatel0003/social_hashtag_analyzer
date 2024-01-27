# Generated by Django 5.0.1 on 2024-01-27 03:54

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_user_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
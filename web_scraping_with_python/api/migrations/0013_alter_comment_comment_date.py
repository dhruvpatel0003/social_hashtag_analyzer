# Generated by Django 5.0.1 on 2024-01-19 05:56

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_comment_comment_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='comment_date',
            field=models.DateField(default=datetime.date(2024, 1, 19)),
        ),
    ]

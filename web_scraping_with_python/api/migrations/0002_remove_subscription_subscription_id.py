# Generated by Django 5.0.1 on 2024-03-15 07:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscription',
            name='subscription_id',
        ),
    ]

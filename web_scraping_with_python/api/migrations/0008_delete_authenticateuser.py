# Generated by Django 5.0.1 on 2024-01-24 16:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_authenticateuser'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AuthenticateUser',
        ),
    ]
# Generated by Django 5.0.1 on 2024-03-01 08:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_remove_userprofile_profile_photo_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hashtagstats',
            name='user',
        ),
    ]

# Generated by Django 5.0.1 on 2024-01-18 08:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_hashtag_hashtag'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hashtagstats',
            name='hashtag',
        ),
    ]
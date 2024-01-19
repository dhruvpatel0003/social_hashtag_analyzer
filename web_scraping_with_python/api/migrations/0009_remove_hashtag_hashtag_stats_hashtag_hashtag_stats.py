# Generated by Django 5.0.1 on 2024-01-19 04:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_remove_hashtag_hashtag_stats_hashtag_hashtag_stats'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hashtag',
            name='hashtag_stats',
        ),
        migrations.AddField(
            model_name='hashtag',
            name='hashtag_stats',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hashtag', to='api.hashtagstats'),
        ),
    ]
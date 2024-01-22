# Generated by Django 5.0.1 on 2024-01-19 06:04

import datetime
import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('likes', models.IntegerField(default=0)),
                ('retweets', models.IntegerField(default=0)),
                ('comment_date', models.DateField(default=datetime.date(2024, 1, 19))),
            ],
        ),
        migrations.CreateModel(
            name='HashTagStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='InstagramStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followers', models.CharField(max_length=20)),
                ('followings', models.CharField(max_length=20)),
                ('posts', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('email', models.EmailField(max_length=100, unique=True)),
                ('password', models.CharField(max_length=15, unique=True)),
                ('phone_number', models.CharField(max_length=10, unique=True)),
                ('subscription_status', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='YouTubeStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('views_count', models.IntegerField(default=0)),
                ('subscription_count', models.IntegerField(default=0)),
                ('video_count', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='HashTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hashtag', models.CharField(blank=True, max_length=100, null=True)),
                ('hashtag_stats', models.ManyToManyField(related_name='hashtags', to='api.hashtagstats')),
            ],
        ),
        migrations.AddField(
            model_name='hashtagstats',
            name='instagram_stats',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='instagram_stats', to='api.instagramstats'),
        ),
        migrations.CreateModel(
            name='TwitterStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followers', models.CharField(max_length=20)),
                ('followings', models.CharField(max_length=20)),
                ('joining_date', models.DateField()),
                ('comments', models.ManyToManyField(related_name='twitter_comments', to='api.comment')),
            ],
        ),
        migrations.AddField(
            model_name='hashtagstats',
            name='twitter_stats',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='twitter_stats', to='api.twitterstats'),
        ),
        migrations.AddField(
            model_name='hashtagstats',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.user'),
        ),
        migrations.AddField(
            model_name='hashtagstats',
            name='youtube_stats',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='youtube_stats', to='api.youtubestats'),
        ),
    ]

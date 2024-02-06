# Generated by Django 5.0.1 on 2024-02-05 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_comment_comment_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='HashtagIncludeSearch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=1000, null=True)),
                ('text', models.CharField(max_length=1000, null=True)),
                ('url', models.CharField(max_length=1000, null=True)),
                ('views', models.IntegerField(default=0, null=True)),
                ('reposts', models.IntegerField(default=0, null=True)),
                ('comment_date', models.CharField(max_length=100, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='twitterstats',
            name='hashtagIncludeSearch',
            field=models.ManyToManyField(related_name='twitter_hashtagIncludeSearch', to='api.hashtagincludesearch'),
        ),
    ]
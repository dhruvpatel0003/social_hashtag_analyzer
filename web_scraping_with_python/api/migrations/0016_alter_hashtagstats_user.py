# Generated by Django 5.0.1 on 2024-02-03 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_comment_comments_comment_text_comment_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hashtagstats',
            name='user',
            field=models.CharField(max_length=100),
        ),
    ]
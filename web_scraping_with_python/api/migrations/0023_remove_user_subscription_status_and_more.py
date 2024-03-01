# Generated by Django 5.0.1 on 2024-02-17 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_history'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='subscription_status',
        ),
        migrations.AddField(
            model_name='user',
            name='subscription_amount',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='subscription_date',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='subscription_expires_date',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
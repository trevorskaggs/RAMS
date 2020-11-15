# Generated by Django 3.1.2 on 2020-11-14 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hotline', '0008_visitnote'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='servicerequest',
            name='forced_entry',
        ),
        migrations.RemoveField(
            model_name='servicerequest',
            name='outcome',
        ),
        migrations.RemoveField(
            model_name='servicerequest',
            name='owner_notification_notes',
        ),
        migrations.RemoveField(
            model_name='servicerequest',
            name='owner_notification_tstamp',
        ),
        migrations.RemoveField(
            model_name='servicerequest',
            name='recovery_time',
        ),
        migrations.AddField(
            model_name='visitnote',
            name='forced_entry',
            field=models.BooleanField(default=False),
        ),
    ]
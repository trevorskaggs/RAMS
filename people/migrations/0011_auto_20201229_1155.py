# Generated by Django 3.1 on 2020-12-29 19:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0010_person_alt_phone'),
    ]

    operations = [
        migrations.RenameField(
            model_name='person',
            old_name='best_contact',
            new_name='comments',
        ),
    ]

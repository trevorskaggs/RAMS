# Generated by Django 3.1.2 on 2020-12-28 15:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0009_person_alt_phone'),
        ('animals', '0012_auto_20201223_0605'),
    ]

    operations = [
        migrations.AddField(
            model_name='animal',
            name='reporter',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='animals', to='people.person'),
        ),
    ]

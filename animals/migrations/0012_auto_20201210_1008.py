# Generated by Django 3.1.2 on 2020-12-10 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0008_auto_20201104_1730'),
        ('animals', '0011_auto_20201114_1439'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='animal',
            name='owner',
        ),
        migrations.AddField(
            model_name='animal',
            name='owner',
            field=models.ManyToManyField(to='people.Person'),
        ),
    ]
# Generated by Django 3.1.2 on 2020-12-14 02:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0008_auto_20201104_1730'),
        ('animals', '0012_auto_20201210_1008'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='owner',
            field=models.ManyToManyField(blank=True, to='people.Person'),
        ),
    ]

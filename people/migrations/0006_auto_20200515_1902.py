# Generated by Django 3.0.4 on 2020-05-15 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('people', '0005_auto_20200506_1159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='address',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='person',
            name='apartment',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='person',
            name='best_contact',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='person',
            name='city',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='person',
            name='drivers_license',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='person',
            name='email',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='person',
            name='phone',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='person',
            name='zip_code',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
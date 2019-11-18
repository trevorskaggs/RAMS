# Generated by Django 2.1.11 on 2019-11-03 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('animals', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='age',
            field=models.CharField(blank=True, choices=[('Y', 'Youth (< 2 Years)'), ('A', 'Adult (2 - 8 Years)'), ('E', 'Elderly (8+ Years)')], max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='animal',
            name='size',
            field=models.CharField(blank=True, choices=[('S', 'Small'), ('M', 'Medium'), ('L', 'Large')], max_length=1, null=True),
        ),
        migrations.AlterField(
            model_name='animal',
            name='species',
            field=models.CharField(blank=True, choices=[('cat', 'Cat'), ('dog', 'Dog'), ('horse', 'Horse'), ('oth', 'Other')], max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='animal',
            name='status',
            field=models.CharField(blank=True, choices=[('Reported', 'Reported'), ('Sheltered', 'Sheltered'), ('Sheltered In Place', 'Sheltered In Place'), ('Not Found', 'Not Found'), ('Rest In Peace', 'Rest In Peace')], default='REP', max_length=3, null=True),
        ),
    ]

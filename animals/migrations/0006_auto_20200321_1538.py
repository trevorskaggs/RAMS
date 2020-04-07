# Generated by Django 3.0.3 on 2020-03-21 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('animals', '0005_auto_20191208_1940'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='animal',
            name='breed',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='cage',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='chip_info',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='chipped',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='collar_info',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='diet_needs',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='diet_notes',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='markings',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='med_needs',
        ),
        migrations.RemoveField(
            model_name='animal',
            name='med_notes',
        ),
        migrations.AddField(
            model_name='animal',
            name='color_notes',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='animal',
            name='age',
            field=models.CharField(blank=True, choices=[('none', 'None'), ('black', 'Black'), ('blue', 'Blue'), ('brown', 'Brown'), ('tan', 'Tan'), ('brindle', 'Brindle'), ('cream', 'Cream/Taupe'), ('gold', 'Gold'), ('gray', 'Gray'), ('red', 'Red'), ('white', 'White'), ('yellow', 'Yellow'), ('black', 'Black'), ('caramel', 'Caramel'), ('chocolate', 'Chocolate'), ('cinnamon', 'Cinnamon'), ('grey', 'Grey'), ('orange', 'Orange'), ('white', 'White')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='animal',
            name='pcolor',
            field=models.CharField(blank=True, choices=[('none', 'None'), ('black', 'Black'), ('blue', 'Blue'), ('brown', 'Brown'), ('tan', 'Tan'), ('brindle', 'Brindle'), ('cream', 'Cream/Taupe'), ('gold', 'Gold'), ('gray', 'Gray'), ('red', 'Red'), ('white', 'White'), ('yellow', 'Yellow'), ('black', 'Black'), ('caramel', 'Caramel'), ('chocolate', 'Chocolate'), ('cinnamon', 'Cinnamon'), ('grey', 'Grey'), ('orange', 'Orange'), ('white', 'White')], max_length=50, null=True, verbose_name='Primary Color'),
        ),
        migrations.AlterField(
            model_name='animal',
            name='scolor',
            field=models.CharField(blank=True, choices=[('none', 'None'), ('black', 'Black'), ('blue', 'Blue'), ('brown', 'Brown'), ('tan', 'Tan'), ('brindle', 'Brindle'), ('cream', 'Cream/Taupe'), ('gold', 'Gold'), ('gray', 'Gray'), ('red', 'Red'), ('white', 'White'), ('yellow', 'Yellow'), ('black', 'Black'), ('caramel', 'Caramel'), ('chocolate', 'Chocolate'), ('cinnamon', 'Cinnamon'), ('grey', 'Grey'), ('orange', 'Orange'), ('white', 'White')], max_length=50, null=True, verbose_name='Secondary Color'),
        ),
        migrations.AlterField(
            model_name='animal',
            name='size',
            field=models.CharField(blank=True, choices=[('Small', 'Small (< 20 lbs)'), ('Medium', 'Medium (21 - 60 lbs)'), ('Large', 'Large (61 - 110 lbs)'), ('Giant', 'Giant (111+ lbs)'), ('Small', 'Small ( < 10 lbs)'), ('Full Size', 'Full Size (10+ lbs)')], max_length=10, null=True),
        ),
    ]

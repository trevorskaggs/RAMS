# Generated by Django 2.1.11 on 2019-11-02 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('people', '0001_initial'),
        ('shelter', '0001_initial'),
        ('hotline', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Animal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(blank=True, max_length=50, null=True)),
                ('apartment', models.CharField(blank=True, max_length=50, null=True)),
                ('city', models.CharField(blank=True, max_length=50, null=True)),
                ('state', models.CharField(blank=True, choices=[('AL', 'AL'), ('AK', 'AK'), ('AZ', 'AZ'), ('AR', 'AR'), ('CA', 'CA'), ('CO', 'CO'), ('CT', 'CT'), ('DE', 'DE'), ('FL', 'FL'), ('GA', 'GA'), ('HI', 'HI'), ('ID', 'ID'), ('IL', 'IL'), ('IN', 'IN'), ('IA', 'IA'), ('KS', 'KS'), ('KY', 'KY'), ('LA', 'LA'), ('ME', 'ME'), ('MD', 'MD'), ('MA', 'MA'), ('MI', 'MI'), ('MN', 'MN'), ('MS', 'MS'), ('MO', 'MO'), ('MT', 'MT'), ('NE', 'NE'), ('NV', 'NV'), ('NH', 'NH'), ('NJ', 'NJ'), ('NM', 'NM'), ('NY', 'NY'), ('NC', 'NC'), ('ND', 'ND'), ('OH', 'OH'), ('OK', 'OK'), ('PA', 'PA'), ('RI', 'RI'), ('SC', 'SC'), ('SD', 'SD'), ('TN', 'TN'), ('TX', 'TX'), ('VA', 'VA'), ('VT', 'VT'), ('WA', 'WA'), ('WV', 'WV'), ('WI', 'WI'), ('WY', 'WY')], max_length=2, null=True)),
                ('zip_code', models.CharField(blank=True, max_length=50, null=True)),
                ('latitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('longitude', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('name', models.CharField(blank=True, max_length=50, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/animals')),
                ('species', models.CharField(blank=True, choices=[('dog', 'Dog'), ('cat', 'Cat'), ('oth', 'Other')], max_length=50, null=True)),
                ('breed', models.CharField(blank=True, choices=[('val', 'Label')], max_length=50, null=True)),
                ('sex', models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female')], max_length=1, null=True)),
                ('pcolor', models.CharField(blank=True, choices=[('black', 'Black'), ('blue', 'Blue'), ('brown', 'Brown'), ('cream', 'Cream/Taupe'), ('gold', 'Gold'), ('gray', 'Gray'), ('red', 'Red'), ('white', 'White'), ('yellow', 'Yellow')], max_length=50, null=True)),
                ('scolor', models.CharField(blank=True, choices=[('black', 'Black'), ('blue', 'Blue'), ('brown', 'Brown'), ('cream', 'Cream/Taupe'), ('gold', 'Gold'), ('gray', 'Gray'), ('red', 'Red'), ('white', 'White'), ('yellow', 'Yellow')], max_length=50, null=True)),
                ('markings', models.CharField(blank=True, choices=[('merle', 'Merle'), ('tuxedo', 'Tuxedo'), ('harlequin', 'Harlequin'), ('spotted', 'Spotted'), ('speckled', 'Speckled'), ('brindle', 'Brindle'), ('saddle', 'Saddle'), ('sable', 'Sable'), ('hairless', 'Hairless')], max_length=50, null=True)),
                ('size', models.CharField(blank=True, choices=[('S', 'Small ()'), ('M', 'Medium ()'), ('L', 'Large ()')], max_length=1, null=True)),
                ('age', models.CharField(blank=True, choices=[('Y', 'Youth ()'), ('A', 'Adult ()'), ('E', 'Elderly ()')], max_length=1, null=True)),
                ('status', models.CharField(blank=True, choices=[('REP', 'Reported'), ('SHL', 'Sheltered'), ('SIP', 'Sheltered In Place'), ('NFD', 'Not Found'), ('RIP', 'Rest In Peace')], default='REP', max_length=3, null=True)),
                ('fixed', models.BooleanField(blank=True, null=True)),
                ('aggressive', models.BooleanField(blank=True, null=True)),
                ('confined', models.BooleanField(blank=True, null=True)),
                ('chipped', models.BooleanField(blank=True, null=True)),
                ('diet_needs', models.BooleanField(blank=True, null=True)),
                ('med_needs', models.BooleanField(blank=True, null=True)),
                ('collared', models.BooleanField(blank=True, null=True)),
                ('attended_to', models.BooleanField(blank=True, null=True)),
                ('collar_info', models.TextField(blank=True, null=True)),
                ('behavior_notes', models.TextField(blank=True, null=True)),
                ('chip_info', models.TextField(blank=True, null=True)),
                ('diet_notes', models.TextField(blank=True, null=True)),
                ('med_notes', models.TextField(blank=True, null=True)),
                ('last_seen', models.DateTimeField(blank=True, null=True)),
                ('cage', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='shelter.Cage')),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='people.Person')),
                ('request', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='hotline.ServiceRequest')),
            ],
            options={
                'ordering': [],
            },
        ),
    ]

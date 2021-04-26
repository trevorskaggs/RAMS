# Generated by Django 3.1.2 on 2021-04-20 18:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('evac', '0011_auto_20210420_1128'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssignedRequests',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('animals', models.JSONField()),
                ('dispatch_assignment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='evac.evacassignment')),
                ('owner_contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='people.ownercontact')),
                ('service_request', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='hotline.servicerequest')),
                ('visit_note', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hotline.visitnote')),
            ],
        ),
        migrations.AddField(
            model_name='evacassignment',
            name='service_requests',
            field=models.ManyToManyField(related_name='evacuation_assignments', through='evac.AssignedRequests', to='hotline.ServiceRequest'),
        ),
    ]
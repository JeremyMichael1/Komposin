# Generated by Django 5.1 on 2024-08-31 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.IntegerField()),
                ('product_name', models.CharField(max_length=255)),
                ('created', models.DateTimeField()),
                ('days_expired', models.IntegerField()),
                ('qty', models.DecimalField(decimal_places=2, max_digits=10)),
                ('uom', models.CharField(max_length=50)),
                ('due_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'm_product',
            },
        ),
    ]

# Generated by Django 4.2.7 on 2023-11-30 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_alter_profile_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ImageField(default='https://d18tf8tm5a95y6.cloudfront.net/static_root/img/avatar.png', upload_to='avatars/'),
        ),
    ]
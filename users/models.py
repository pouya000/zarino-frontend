from django.contrib.auth.models import AbstractUser
from django.db import models



class Users(AbstractUser):
    USER_TYPE_CHOICES = (
        ('customer', 'Customer'),
        ('seller', 'Seller'),
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='customer')
    email = models.EmailField(max_length=200, unique=True)
    email_activation_code=models.CharField(max_length=300,verbose_name='کد اعتبار سنجی')
    mobile = models.CharField(max_length=12, null=True, blank=True, verbose_name='شماره موبایل')
    address = models.CharField(max_length=255, verbose_name='آدرس')


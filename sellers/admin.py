from django.contrib import admin
from sellers import models

# Register your models here.
@admin.register(models.Seller)
class SellerAdmin(admin.ModelAdmin):
    list_display = ['user', 'store_name', 'address']

    class Meta:
        model = models.Seller
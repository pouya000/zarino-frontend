from django.contrib import admin
from users import models


@admin.register(models.Users)
class UserAdmin(admin.ModelAdmin):
    pass
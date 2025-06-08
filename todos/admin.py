from django.contrib import admin
from todos import models


@admin.register(models.Todos)
class TodoAdmin(admin.ModelAdmin):
    list_display = ['month', 'description', 'is_completed','user']

    class Meta:
        model = models.Todos

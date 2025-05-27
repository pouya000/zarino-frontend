from django.db import models
from users.models import Users

class Income(models.Model):
    month = models.CharField(max_length=50)
    incomeType = models.CharField(max_length=50)
    incomeAmount = models.IntegerField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE,related_name='income')

class Exspense(models.Model):
    month = models.CharField(max_length=50)
    exspenseType = models.CharField(max_length=50)
    exspenseAmount = models.IntegerField()
    user = models.ForeignKey(Users, on_delete=models.CASCADE,related_name='exspense')

class Todos(models.Model):
    month = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    is_completed = models.BooleanField(null=True,blank=True,default=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE,related_name='todos')

    # pendding = models.BooleanField(null=True,blank=True)

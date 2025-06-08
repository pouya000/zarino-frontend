from rest_framework import serializers
from todos.models import Income, Exspense, Todos


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'incomeType', 'incomeAmount']


class ExspenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exspense
        fields = ['id', 'exspenseType', 'exspenseAmount']


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todos
        fields = '__all__'

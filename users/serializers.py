from rest_framework import serializers
from todos.serializer import TodoSerializer
from django.contrib.auth.hashers import make_password
from .models import Users
from sellers.models import Customer, Seller, Transaction


class UserSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(read_only=True, many=True)

    class Meta:
        model = Users
        # fields = ['id', 'email', 'password']
        fields = '__all__'

        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     instance = self.Meta.model(**validated_data)
    #     if password is not None:
    #         instance.set_password(password)
    #     instance.save()
    #     return instance


class TransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.first_name', read_only=True)

    class Meta:
        model = Transaction
        # fields = ['id', 'customer', 'customer_name', 'seller', 'price', 'weight', 'date']
        fields = '__all__'

    # def validate(self, data):
    #     customer_id = self.initial_data.get('customer')
    #     seller_id = self.initial_data.get('seller')
    #
    #     if customer_id and seller_id and str(customer_id) == str(seller_id):
    #         raise serializers.ValidationError("A customer cannot make a transaction with themselves.")
    #     return data


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'sellers']


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['id', 'store_name', 'address']

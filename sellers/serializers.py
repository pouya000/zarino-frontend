from rest_framework import serializers
from django.contrib.auth.hashers import make_password
# from .models import Users


# class RegisterSerializer(serializers.ModelSerializer):
#     user_type = serializers.ChoiceField(choices=Users.USER_TYPE_CHOICES)
#
#     class Meta:
#         model = Users
#         fields = ("username", "email", "password", "user_type")
#         extra_kwargs = {"password": {"write_only": True}}
#
#     def create(self, validated_data):
#         user_type = validated_data.pop("user_type")
#         password = validated_data.pop("password")
#
#         # ایجاد کاربر با رمز عبور هش شده
#         user = Users.objects.create(
#             **validated_data,
#             password=make_password(password),
#             user_type=user_type
#         )
#
#         # ایجاد مدل مرتبط (Seller یا Customer)
#         if user_type == "seller":
#             Seller.objects.create(user=user)
#         else:
#             Customer.objects.create(user=user)
#
#         return user


# {
#     "username":  "aaa",
#     "email":  "puya5@gmail.com",
#     "password":"123",
#     "user_type": "seller"
# }
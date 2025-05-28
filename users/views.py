import asyncio
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from django.utils.crypto import get_random_string
from django.utils.dateparse import parse_date
from rest_framework import status
# from sellers.models import Seller, Customer
from sellers.models import Customer, Seller, Transaction, LatestGoldPrice
from users.models import Users
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from utils.email_services import send_email
from .serializers import UserSerializer, CustomerSerializer, SellerSerializer, TransactionSerializer
import jwt, datetime
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.views import View
# from datetime import datetime


class RegisterView(APIView):
    def post(self, request):
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']
        address = request.data['address']
        user_type = request.data['user_type']

        print("data in register api ... ", username, address, user_type)
        is_user_exist = Users.objects.filter(email=email).exists()
        # user = Users.objects.filter(email=email).first()
        # print('userrrrrrr ... ', user.groups)

        if not is_user_exist:
            new_user = Users(username=username, email=email, address=address,user_type = user_type,
                             email_activation_code=get_random_string(6), is_active=False)
            new_user.set_password(password)
            new_user.save()
            # return Response({"message": "ثبت ‌نام با موفقیت انجام شددر register2 !", "user_id": user.id}, status=status.HTTP_201_CREATED)
            print('new_user in if >>>>>>> ', new_user.email, new_user.username)
            send_email('فعالسازی حساب کاربر', new_user.email, {'user': new_user}, 'emails/activation_account.html')
            serializer = UserSerializer(new_user)
            # serializer.is_valid(raise_exception=True)
            # serializer.save()
            print("serializer ..........", serializer)
            return Response(serializer.data)


class CreateCustomerView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')  # دریافت ID کاربر از درخواست
        user = get_object_or_404(Users, id=user_id)  # پیدا کردن کاربر
        if hasattr(user, 'customer'):
            return Response({'error': 'User is already a customer'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)  # ارتباط `Customer` با `User`
            print("CreateCustomerView result ... ", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddSellerToCustomerView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        seller_id = request.data.get('seller_id')

        user = get_object_or_404(Users, id=user_id)
        seller = get_object_or_404(Seller, id=seller_id)

        if not hasattr(user, 'customer'):
            return Response({'error': 'Customer profile not found!'}, status=status.HTTP_400_BAD_REQUEST)

        customer = user.customer
        customer.sellers.add(seller)  # اضافه کردن فروشنده جدید

        return Response({'message': 'Seller added successfully!'}, status=status.HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        # seller_id = request.data['seller_id']
        user = Users.objects.filter(email=email).first()
        print("user in login is: ", user)
        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')
        customer_id = None
        seller_id = None

        if user.user_type == 'customer':
            print("user type in login is: ", user.user_type)
            customer = Customer.objects.filter(user=user).first()
            if customer:
                customer_id = customer.id

        if user.user_type == 'seller':
            seller = Seller.objects.filter(user=user).first()
            if seller:
                seller_id = seller.id

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=6000),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True, max_age=60000)

        if user.user_type == 'customer':
            response.data = {
                'jwt': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': 'customer',
                    'customer_id': customer_id
                }
            }

        if user.user_type == 'seller':
            response.data = {
                'jwt': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': 'seller',
                    'seller_id': seller_id
                }
            }

        return response


# class SetCustomerIdAfterRegisterView(APIView):
#     def post(self, request):
#         email = request.data['email']
#         user = Users.objects.filter(email=email).first()
#         if user is None:
#             raise AuthenticationFailed('User not found!')
#
#         customer_id = None
#         if user.user_type == 'customer':
#             customer = Customer.objects.filter(user=user).first()
#             if customer:
#                 customer_id = customer.id
#         payload = {
#             'id': user.id,
#             'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=600),
#             'iat': datetime.datetime.utcnow()
#         }
#
#         token = jwt.encode(payload, 'secret', algorithm='HS256')
#         response = Response()
#         # response.set_cookie(key='jwt', value=token, httponly=True)
#         response.data = {
#             'jwt': token,
#             'user': {
#                 'id': user.id,
#                 'username': user.username,
#                 'email': user.email,
#                 'user_type': user.user_type,
#                 'customer_id': customer_id
#             }
#         }
#         return response


from django.http import HttpResponse
import os

def check_env(request):
    return HttpResponse(f"<pre>DATABASE_URL = {os.environ.get('DATABASE_URL')}</pre>")

class CustomerSellersView(APIView):
    def get(self, request):
        print("i am in CustomerSellersView")
        # دریافت توکن JWT از کوکی
        token = request.COOKIES.get('jwt')

        if not token:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED)

        # دریافت کاربر لاگین‌شده
        user = get_object_or_404(Users, id=payload['id'])

        # بررسی اینکه کاربر از نوع customer است
        if user.user_type != 'customer':
            return Response({'error': 'Only customers can view their sellers'}, status=status.HTTP_403_FORBIDDEN)

        # دریافت `customer_id`
        customer = get_object_or_404(Customer, user=user)

        # دریافت تمام فروشندگان مرتبط با این مشتری
        sellers = customer.sellers.all()

        # تبدیل لیست فروشندگان به JSON
        seller_list = [{'id': seller.id, 'store_name': seller.store_name} for seller in sellers]

        return Response({'sellers': seller_list}, status=status.HTTP_200_OK)


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = Users.objects.filter(id=payload['id']).first()
        print("user in api-user ----> ", user)
        print("user in payload ----> ", payload['id'])

        # response_data = {'id': user.id, 'email': user.email, 'name': user.name}
        serializer = UserSerializer(user)
        return Response(serializer.data)


class SellerView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        seller = Seller.objects.all()

        print("seller in api-user ----> ", seller)
        # print("seller in payload ----> ",payload['id'])

        # response_data = {'id': user.id, 'email': user.email, 'name': user.name}
        serializer = SellerSerializer(seller, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SellerDetailView(APIView):
    def get(self, request, seller_id):
        token = request.COOKIES.get('jwt')
        print("i am in SellerDetailView(")
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            seller = Seller.objects.get(id=seller_id)
        except Seller.DoesNotExist:
            return Response({'error': 'Seller not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SellerSerializer(seller)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class CreateTransactionView(APIView):
#     def post(self, request):
#         customer_id = request.data.get('customer_id')
#         seller_id = request.data.get('seller_id')
#         price = request.data.get('price')
#         weight = request.data.get('weight')
#
#
#         customer = get_object_or_404(Customer, id=customer_id)
#         seller = get_object_or_404(Seller, id=seller_id)
#
#         transaction = Transaction.objects.create(customer=customer, seller=seller, price=price, weight=weight)
#         return Response({'message': 'Transaction created successfully!', 'transaction_id': transaction.id}, status=status.HTTP_201_CREATED)

class CreateTransactionView(APIView):
    def post(self, request):
        print("i am in trasaction")
        customer_id = request.data.get('customer_id')
        seller_id = request.data.get('seller_id')
        weight = request.data.get('weight')
        price = request.data.get('price')
        transaction_type = request.data.get('transaction_type')
        print("price", price, "customer_id", customer_id)

        customer = get_object_or_404(Customer, id=customer_id)
        seller = get_object_or_404(Seller, id=seller_id)
        print("customer is: ", customer, "seller is: ", seller)
        transaction_data = {
            "customer": customer.id,
            "seller": seller.id,
            "weight": weight,
            "price": price,
            "transaction_type": transaction_type
        }

        serializer = TransactionSerializer(data=transaction_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class CreateTransactionView(APIView):
#     def post(self, request):
#         # دریافت توکن JWT از کوکی
#         token = request.COOKIES.get('jwt')
#
#         if not token:
#             return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
#
#         try:
#             payload = jwt.decode(token, 'secret', algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             return Response({'error': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED)
#
#         # دریافت کاربر لاگین شده
#         user = get_object_or_404(Users, id=payload['id'])
#
#         # بررسی اینکه کاربر یک Customer است
#         if user.user_type != 'customer':
#             return Response({'error': 'Only customers can create transactions'}, status=status.HTTP_403_FORBIDDEN)
#
#         # دریافت customer از مدل
#         customer = get_object_or_404(Customer, user=user)
#
#         # دریافت `seller_id` از درخواست
#         seller_id = request.data.get('seller_id')
#         amount = request.data.get('amount')
#
#         if not seller_id or not amount:
#             return Response({'error': 'seller_id and amount are required'}, status=status.HTTP_400_BAD_REQUEST)
#
#         # بررسی اینکه فروشنده وجود دارد
#         seller = get_object_or_404(Seller, id=seller_id)
#
#         # ایجاد تراکنش جدید
#         transaction = Transaction.objects.create(customer=customer, seller=seller, amount=amount)
#
#         return Response({'message': 'Transaction created successfully', 'transaction_id': transaction.id}, status=status.HTTP_201_CREATED)


# class CustomerTransactionsView(APIView):
#     def get(self, request, customer_id):
#         customer = get_object_or_404(Customer, id=customer_id)
#         transactions = Transaction.objects.filter(customer=customer)
#         serializer = TransactionSerializer(transactions, many=True)
#         return Response(serializer.data)
#
# class SellerTransactionsView(APIView):
#     def get(self, request, seller_id):
#         seller = get_object_or_404(Seller, id=seller_id)
#         transactions = Transaction.objects.filter(seller=seller)
#         serializer = TransactionSerializer(transactions, many=True)
#         return Response(serializer.data)


# from rest_framework import viewsets
# class SellerViewSet(viewsets.ReadOnlyModelViewSet):  # فقط خواندنی
#     queryset = Seller.objects.all()
#     serializer_class = SellerSerializer

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response


# class UpdatePriceView(APIView):
#     permission_classes = [IsAuthenticated]
#     print("i am in update price")
#     def put(self, request, seller_id):
#         seller = get_object_or_404(Seller, id=seller_id, user=request.user)
#
#         new_price = request.data.get("price")
#         if new_price is None:
#             return Response({"error": "Price is required"}, status=400)
#
#         seller.price = new_price
#         seller.save()
#
#         # ارسال قیمت جدید به WebSocket
#         channel_layer = get_channel_layer()
#         asyncio.run(channel_layer.group_send(
#             f"seller_{seller.id}",
#             {
#                 "type": "send_price_update",
#                 "new_price": new_price
#             }
#         ))
#
#         return Response({"message": "Price updated successfully", "price": new_price})

class LatestGoldPriceView(APIView):
    def get(self, request, seller_id):
        try:
            # latest_price = LatestGoldPrice.objects.filter(seller_id=seller_id).latest('updated_at')
            latest_prices = LatestGoldPrice.objects.filter(seller_id=seller_id).all()
            price_list = [
                {
                    "transaction_type": item.transaction_type,
                    "price": item.price,
                    "updated_at": item.updated_at
                }
                for item in latest_prices
            ]
            return Response(price_list, status=status.HTTP_200_OK)

        except LatestGoldPrice.DoesNotExist:
            return Response({"error": "No price data found"}, status=status.HTTP_404_NOT_FOUND)

# views.py
class SellerStatusStoreView(APIView):
    def get(self, request, seller_id):
        seller = get_object_or_404(Seller, id=seller_id)
        return Response({
            "store_name": seller.store_name,
            "is_open": seller.is_open
        })



class TransactionSearchView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        # احراز هویت کاربر از طریق JWT
        # try:
        #     payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated!')

        seller_id = request.GET.get('seller_id')  # دریافت آی‌دی فروشنده از پارامترهای کوئری
        customer_name = request.GET.get('customer_name', '')  # دریافت نام مشتری از پارامترهای کوئری
        transaction_date = request.GET.get('transaction_date', '')  # دریافت تاریخ از پارامترهای کوئری
        print("seller_id: ", seller_id, "customer_name: ", customer_name, 'transaction_date : ', transaction_date)
        if not seller_id:
            return Response({'error': 'Seller ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        transactions = Transaction.objects.filter(seller_id=seller_id)
        print("transactions: ", transactions)

        # فیلتر بر اساس نام مشتری hghjhj
        if customer_name:
            transactions = transactions.filter(customer__user__first_name__iexact=customer_name)
            print("after customer_name filter:", transactions)

        # فیلتر بر اساس تاریخ تراکنش
        if transaction_date:
            parsed_date = datetime.datetime.strptime(transaction_date, "%Y-%m-%d %H:%M:%S").date()
            transactions = transactions.filter(date__date=parsed_date)
            print('transactions By date: ', transactions)

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

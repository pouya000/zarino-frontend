from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# from sellers.serializers import RegisterSerializer
from users.models import Users


# Create your views here.

# class RegisterView(APIView):
#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             return Response({"message": "ثبت ‌نام با موفقیت انجام شددر register2 !", "user_id": user.id}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class sellersView(APIView):
#     print('i am in sellers')
#
#     def get_object(self, pk):
#         try:
#             user = Users.objects.filter(id=pk)
#             print("user1 id is: ", user)
            # return user
        # except Sellers.DoesNotExist:
        #     raise Http404


# class sellersDetailView(APIView):
#     def put(self,request,seller_id: int):
#         seller = Seller.objects.get(id = seller_id)
#         serializer = SellerSerializer(seller, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

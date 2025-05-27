from django.http import Http404
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import Users
from todos.models import Todos
from todos.serializer import TodoSerializer

class TodosView(APIView):
    def get_object(self, pk):
        try:
            user = Users.objects.filter(id = pk)
            print("user1 id is: ", user)
            return user
        except Todos.DoesNotExist:
            raise Http404

    def get(self,request):
        # user = self.get_object(pk)
        # print("user2 id is: ", user)
        # todos = Todos.objects.filter(id = user_id.id)
        todos = Todos.objects.all()
        serializer = TodoSerializer(todos,many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    def post(self,request):
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print("ser ....", serializer.data)
            return Response(serializer.data, status.HTTP_200_OK)
        return Response(None, status.HTTP_400_BAD_REQUEST)


class TodoDetailView(APIView):
    def put(self,request,todo_id: int):
        todo = Todos.objects.get(id = todo_id)
        serializer = TodoSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # serializer = TodoSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     print("ser ....", serializer.data)
        #     return Response(serializer.data, status.HTTP_200_OK)
        # return Response(None, status.HTTP_400_BAD_REQUEST)





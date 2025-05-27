from django.urls import path
from todos import views

urlpatterns = [
    path('', views.TodosView.as_view()),
    path('<int:todo_id>', views.TodoDetailView.as_view()),

]
from django.urls import path
from . import views

# from rest_framework.routers import DefaultRouter
# from .views import SellerViewSet
# router = DefaultRouter()
# router.register(r'sellers', SellerViewSet, basename='seller')
# from .views import CreateTransactionView

urlpatterns = [
    path('check-env/', views.check_env),
    path('register', views.RegisterView.as_view()),
    path('login', views.LoginView.as_view()),
    path('user', views.UserView.as_view()),
    # path('user2', views.UserView2.as_view()),
    path('logout', views.LogoutView.as_view()),
    path('create-customer', views.CreateCustomerView.as_view(), name='create-customer'),
    path('sellers', views.SellerView.as_view(), name='create-customer'),
    path('seller/<int:seller_id>/', views.SellerDetailView.as_view(), name='seller-detail'),
    path('add-seller-to-customer', views.AddSellerToCustomerView.as_view(), name='create-customer'),
    path('create-transaction', views.CreateTransactionView.as_view(), name='create_transaction'),
    path('customer-sellers', views.CustomerSellersView.as_view(), name='Customer-sellers'),
    # path('update-price/<int:seller_id>/', views.UpdatePriceView.as_view(), name='update-price'),
    path('latest-price/<int:seller_id>/', views.LatestGoldPriceView.as_view()),
    path('latest-status_store/<int:seller_id>/', views.SellerStatusStoreView.as_view()),

    path('transactions/search', views.TransactionSearchView.as_view()),



]

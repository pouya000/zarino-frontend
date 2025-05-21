from django.db import models
from users.models import Users

# Create your models here.


class Seller(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='sellers')
    store_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    is_open = models.BooleanField(default=False)

    def __str__(self):
        return self.store_name

class Customer(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, related_name='customer')
    sellers = models.ManyToManyField(Seller, related_name="customers")  # ارتباط چند به چند

    def __str__(self):
        return f"Customer: {self.user.username}"


class LatestGoldPrice(models.Model):
    seller_id = models.IntegerField()
    price = models.FloatField()
    transaction_type = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.price} تومان"


class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('buy', 'خرید'),
        ('sell', 'فروش'),
    )
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='transactions')
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='transactions')
    price = models.DecimalField(max_digits=11, decimal_places=2)
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPES, default='buy')

    def get_total_price(self):
        return (self.price * self.weight)

    def __str__(self):
        return f"Transaction: {self.customer.user.username} -> {self.seller.store_name} (${self.weight})"


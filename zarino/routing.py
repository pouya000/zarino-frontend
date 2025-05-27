from django.urls import re_path

from . import consumers
from .consumers import PriceConsumer

# websocket_urlpatterns = [
#     # re_path(r"ws/prices/(?P<seller_id>\w+)/$", PriceConsumer.as_asgi()),
#     re_path(r"ws/prices/$", PriceConsumer.as_asgi()),
#
# ]

#
# websocket_urlpatterns = [
#     re_path(r'ws/socket-server/$', consumers.PriceConsumer.as_asgi()),
# ]

# websocket_urlpatterns = [
#     re_path(r'ws/price_updates/(?P<seller_id>\d+)/$', PriceUpdateConsumer.as_asgi()),
# ]

websocket_urlpatterns = [
    re_path(r"ws/price/(?P<seller_id>\d+)/$", PriceConsumer.as_asgi()),
]
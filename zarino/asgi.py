"""
ASGI config for zarino project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zarino.settings')
django.setup()
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from zarino.routing import websocket_urlpatterns

# application = get_asgi_application()

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),  # همچنان از DRF و HTTP استفاده می‌کنیم
#     "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),  # اضافه کردن WebSocket
# })

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
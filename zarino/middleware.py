from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.http import JsonResponse
import jwt, datetime
from users.models import Users


class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        token = request.COOKIES.get('jwt')
        print('i am in middlewRE ...')
        if not token:
            request.user = None
            return
        try:
            # token = token.encode('utf-8')

            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user = Users.objects.get(id=payload['id'])
            request.user = user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, Users.DoesNotExist):
            request.user = None
            return JsonResponse({"error": "Authentication Failed in middleware"}, status=401)

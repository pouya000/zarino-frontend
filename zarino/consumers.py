# import json
#
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import AsyncWebsocketConsumer
#
#
# class PriceConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_group_name = 'test'
#         await (self.channel_layer.group_add)(
#             self.room_group_name,
#             self.channel_name
#         )
#         # self.seller_id = self.scope['url_route']['kwargs']['seller_id']
#         # self.room_group_name = f"prices_{self.seller_id}"
#
#         # await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()
#
#         # await self.send(text_data=json.dumps({
#         #     'type': 'connection_established',
#         #     'message': 'You Arre Now Connected'
#         # }))
#
#         # async def disconnect(self, close_code):
#         #     await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
#         #
#         # async def receive(self, text_data):
#         #     data = json.loads(text_data)
#         #     price = data["price"]
#         #
#         #     await self.channel_layer.group_send(
#         #         self.room_group_name, {"type": "send_price", "price": price}
#         #     )
#         #
#         # async def send_price(self, event):
#         #     await self.send(text_data=json.dumps({"new_price": event["price"]}))
#
#     async def receive(self, text_data=None, bytes_data=None):
#         print("i am in receive")
#         text_data_json = json.loads(text_data)
#         message = text_data_json["message"]
#         print("message: ", message)
#
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 "type": 'chat_message',
#                 "message": message
#             }
#         )
#
#         # self.send(text_data=json.dumps(
#         #     {
#         #         "type": 'chat',
#         #         "message": message
#         #     })
#         # )
#
#     async def chat_message(self, event):
#         print("i am in chat_message")
#
#         message = event['message']
#         await self.send(text_data=json.dumps(
#             {
#                 "type": 'chat',
#                 "message": message
#             })
#         )
#
#
#     async def disconnect(self, close_code):
#         pass


# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
#
# class PriceUpdateConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.seller_id = self.scope['url_route']['kwargs']['seller_id']
#         self.room_group_name = f"seller_{self.seller_id}"
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()
#
#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
#
#     async def send_price_update(self, event):
#         price = event['price']
#         await self.send(text_data=json.dumps({'price': price}))


import json
from datetime import timezone

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from sellers.models import LatestGoldPrice


class PriceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.seller_id = self.scope["url_route"]["kwargs"]["seller_id"]
        self.group_name = f"seller_{self.seller_id}"
        print("seller_id: ", self.seller_id)
        print("self.group_name: ", self.group_name)

        # اضافه کردن سوکت به گروه
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # async def receive1(self, text_data=None, bytes_data=None):
    #     data = json.loads(text_data)
    #     print("data in receive is: ", data)
    #     seller_id = data["seller_id"]  # دریافت شناسه فروشنده
    #     new_price = data["price"]
    #     transaction_type = data.get("transactionType")
    #     print("i am in receive", "seller_id in receive is: ", seller_id)
    #     # استفاده از تابع async برای ذخیره داده در پایگاه داده
    #     await self.update_latest_price(seller_id, new_price, transaction_type)
    #
    #     # ارسال داده به گروه مربوطه
    #     await self.channel_layer.group_send(
    #         self.group_name,
    #         {
    #             "type": "send_price_update",
    #             "seller_id": seller_id,
    #             "price": new_price,
    #             "transaction_type": transaction_type
    #         },
    #     )

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        print("data in receive is: ", data)

        message_type = data.get("message_type")

        if message_type == "price":
            seller_id = data["seller_id"]
            new_price = data["price"]
            transaction_type = data.get("transactionType")

            await self.update_latest_price(seller_id, new_price, transaction_type)

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "send_price_update",
                    "seller_id": seller_id,
                    "price": new_price,
                    "transaction_type": transaction_type
                },
            )

        elif message_type == "store_status":
            status = data["status"]
            await self.update_store_status(self.seller_id, status)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "send_status_store",
                    "status": status
                }
            )

    @database_sync_to_async
    def update_latest_price(self, seller_id, new_price, transaction_type):
        seller_id = seller_id
        transaction_type = transaction_type
        # بررسی اینکه آیا رکوردی با همین seller_id و transaction_type وجود دارد یا نه؟
        existing_price = LatestGoldPrice.objects.filter(
            seller_id=seller_id,
            transaction_type=transaction_type
        ).first()

        if existing_price:
            # اگر رکوردی با همین transaction_type وجود داشت، مقدار قیمت را به‌روزرسانی کن
            existing_price.price = new_price
            # existing_price.updated_at = timezone.now()
            existing_price.save()
            print(f"Updated existing record: {existing_price}")
        else:
            # اگر transaction_type جدید بود، رکورد جدید بساز
            new_record = LatestGoldPrice.objects.create(
                seller_id=seller_id,
                price=new_price,
                transaction_type=transaction_type
            )
            print(f"Created new record: {new_record}")
        print('i am in @update_latest_price', 'seller_id is: ', seller_id)

    @database_sync_to_async
    def update_store_status(self, seller_id, status):
        from sellers.models import Seller

        try:
            seller = Seller.objects.get(id=seller_id)
            seller.is_open = True if status == True else False
            seller.save()
            print(f"Store status updated: {seller.store_name} is now {'OPEN' if seller.is_open else 'CLOSED'}")
        except Seller.DoesNotExist:
            print("Seller not found.")

    async def send_price_update(self, event):
        print("i am in send_price_update consumer")
        price = event["price"]
        transaction_type = event["transaction_type"]

        await self.send(text_data=json.dumps(
            {
                "message_type": "price",
                "price": price,
                "transaction_type": transaction_type
            }
        ))

    async def send_status_store(self, event):
        print("i am in send_status_store consumer")
        status = event["status"]  # open یا close

        await self.send(text_data=json.dumps(
            {
                "message_type": "store_status",
                "status": status
            }
        ))

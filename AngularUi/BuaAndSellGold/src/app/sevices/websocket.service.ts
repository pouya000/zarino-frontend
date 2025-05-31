import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  http = inject(HttpClient);

  baseUrl = environment.apiUrl

  private socket$: any;
  private priceSubject = new Subject<number>();
  private storeStatusSubject = new Subject<'open' | 'close'>();


  connect(sellerId: number) {
    this.socket$ = webSocket(`ws://${this.baseUrl}/ws/price/${sellerId}/`);
    this.socket$.subscribe(
      (message: any) => {
        if (message.message_type === 'price' && message.price !== undefined) {
          this.priceSubject.next(message.price);
        }
        // if (message.price !== undefined) {
        //   this.priceSubject.next(message.price);
        // }
        if (message.message_type === 'store_status' && message.status) {
          this.storeStatusSubject.next(message.status);  // 'open' یا 'close'
        }
      },
      (error: any) => console.error('WebSocket Error:', error),
      () => console.log('WebSocket Disconnected')
    );
    return this.socket$
  }

  // ارسال قیمت طلا
  sendPrice(seller_id: number, price: number, transactionType: string) {
    if (this.socket$) {
      console.log("price is !!! ", price);
      this.socket$.next({
        message_type: 'price',
        price,
        transactionType,
        seller_id
      });
      console.log("قیمت در وب سوکت ارسال شد ...");
    }
  }

  // ارسال وضعیت مغازه
  sendStoreStatus(seller_id: number, status: 'open' | 'close') {
    if (this.socket$) {
      this.socket$.next({
        message_type: 'store_status',
        status,
        seller_id
      });
    }
  }

  // گرفتن آخرین قیمت از API
  getLatestPrice(sellerId: number) {
    return this.http.get(`${this.baseUrl}/latest-price/${sellerId}/`);
  }

  // گرفتن آخرین  -------------------------------
  getLatestStoreStatus(sellerId: number) {
    return this.http.get(`${this.baseUrl}/latest-status_store/${sellerId}/`);
  }

  // دریافت وضعیت مغازه
  getStoreStatusUpdates(): Observable<'open' | 'close'> {
    return this.storeStatusSubject.asObservable();
  }

  // دریافت قیمت لحظه‌ای
  getPriceUpdates(): Observable<number> {
    return this.priceSubject.asObservable();
  }

  // sendStatusOfStore(status: boolean) {
  //   this.socket$.send(JSON.stringify({
  //     message_type: "store_status",
  //     status: "open"  // یا "close"
  //   }));
  // }


  disconnect() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}

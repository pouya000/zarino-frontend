import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  http = inject(HttpClient);

  private socket$: any;
  private priceSubject = new Subject<number>();

  connect(sellerId: number) {
    this.socket$ = webSocket(`ws://localhost:8000/ws/price/${sellerId}/`);
    this.socket$.subscribe(
      (message: any) => {
        // console.log("socket$: ", message)
        if (message.price !== undefined) {
          this.priceSubject.next(message.price);
        }
      },
      (error: any) => console.error('WebSocket Error:', error),
      () => console.log('WebSocket Disconnected')
    );
    return this.socket$
  }

  sendPrice(seller_id: number, price: number, transactionType: string) {
    if (this.socket$) {
      console.log("price is !!! ", price);
      this.socket$.next({price, transactionType, seller_id});
    }
  }

  getLatestPrice(sellerId: number) {
    return this.http.get(`http://localhost:8000/api/latest-price/${sellerId}/`);
  }

  getPriceUpdates(): Observable<number> {
    return this.priceSubject.asObservable();
  }

  disconnect() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}

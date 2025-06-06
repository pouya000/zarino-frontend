import {Component, inject, OnInit} from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonContent} from '@ionic/angular/standalone';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {Router} from "@angular/router";
import {UserService} from "../sevices/user.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab1Page implements OnInit {

  http = inject(HttpClient);

  constructor(private router: Router,
              private userservice: UserService) {
    this.userservice.user$.subscribe(user => {
      if (user) {
        console.log("کاربر وارد شده:", user);
      } else {
        console.log("کاربر احراز هویت نشده است.");
      }
    });
  }


  customerData = {
    user_id: 24,
    address: 'hamedan',
    sellers: [4]
  };

  // transactionData = {
  //   customer_id: localStorage.getItem('customer_id'),  // دریافت customer_id
  //   seller_id: 12,  // شناسه فروشنده انتخاب‌شده
  //   weight: 250.75,  // مبلغ تراکنش
  //   price: 6000
  // };

  // createCustomer() {
  //   this.userservice.createCustomer(this.customerData).subscribe(
  //     response => {
  //       console.log('Customer created successfully', response);
  //     },
  //     error => {
  //       console.error('Error creating customer', error);
  //     }
  //   );
  // }

  ngOnInit() {
    // this.userservice.getUser();
    // this.createtransiction();
  }

  // createtransiction() {
  //   this.userservice.createTransiction(this.transactionData)
  //     .subscribe(response => {
  //       console.log('Transaction Successful:', response);
  //     }, error => {
  //       console.error('Transaction Failed:', error);
  //     });
  //
  // }


}

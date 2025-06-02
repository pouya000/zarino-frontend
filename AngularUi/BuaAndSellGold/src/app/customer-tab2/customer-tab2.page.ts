import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {Router} from "@angular/router";
import {UserService} from "../sevices/user.service";
import {CommonModule, DecimalPipe} from '@angular/common';
// import {environment} from "../../environments/environment";
import {environment} from 'src/environments/environment';
import {OverlayEventDetail} from '@ionic/core/components';
import {goldPrice2} from "../models/goldPrice.interface";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {catchError, of} from "rxjs";
// import {IonicModule} from '@ionic/angular';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonModal,
  IonAvatar,
  IonButton,
  IonButtons,
  IonItem,
  IonImg,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';
import {WebSocketService} from "../sevices/websocket.service";
import {AlertController} from "@ionic/angular";

// const BASE_URL = environment.GET_BASE_URL_GOLD;


@Component({
  selector: 'app-customer-tab2',
  templateUrl: './customer-tab2.page.html',
  styleUrls: ['./customer-tab2.page.scss'],
  standalone: true,
  imports: [IonAvatar,
    IonModal,
    IonButton,
    IonButtons,
    IonItem,
    IonImg,
    IonLabel,
    IonList,
    IonContent, IonHeader, IonTitle, IonToolbar,
    ReactiveFormsModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DecimalPipe]
})
export class CustomerTab2Page implements OnInit {

  http = inject(HttpClient);

  constructor(private router: Router,
              private alertController: AlertController,
              private wsService: WebSocketService,
              private userservice: UserService,
              private fb: FormBuilder) {
    // this.userservice.sellerPrice.subscribe((data: any) => {
    //   console.log("change price is ... ", data)
    // })

    this.userservice.user$.subscribe(user => {
      if (user) {
        console.log("کاربر وارد شده:", user);
        this.receive_user = user;
        console.log("receive_user: ", this.receive_user);

      } else {
        console.log("کاربر احراز هویت نشده است.");
      }
    });

    this.createTransactionForm = this.fb.group({
      "customer_id": [localStorage.getItem('customer_id'), Validators.required],
      "seller_id": [localStorage.getItem('seller_id'), Validators.required],
      "weight": ['', Validators.required],
      "price": ['', Validators.required],
      "transaction_type": ['']

    })
  }

  @ViewChild(IonModal) modal!: IonModal;

  transactionType: 'buy' | 'sell' = 'buy';

  openModal(type: 'buy' | 'sell') {
    this.transactionType = type;
    this.modal.present();
  }

  BASE_URL: any;

  API_KEY_GOLD: any;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';

  name: string = '';

  receive_user: any;

  sellerId: number = Number(localStorage.getItem('seller_id'));

  seller_name: string = '';

  gold_price2: goldPrice2 | null = null;

  sellPrice: number = 0;

  buyPrice: number = 0;

  updateSellPrice = signal<number>(0);

  updateBuyPrice = signal<number>(0);

  price: number = 0;

  storeStatus: boolean = true;

  latestChangeSellPrice: number = 0;

  latestChangeBuyPrice: number = 0;

  selectedWeight: any;

  selectedPrice: any;

  customerseller: any;

  createTransactionForm: FormGroup;

  date: any;

  time: any;

  ngOnInit() {

    console.log("i am in init in customer tab")

    this.BASE_URL = this.userservice.GET_BASE_URL_GOLD;

    this.API_KEY_GOLD = this.userservice.API_KEY_GOLD;

    this.getGoldPrice();

    this.getPrice();

    this.customerSellers();

    this.getSellerById();

    // دریافت آخرین قیمت از API
    this.latestChangePrice();

    this.wsService.connect(this.sellerId).subscribe((data: any) => {
      console.log("return data is: ", data);
      if (data.status === true) {
        console.log('مغازه باز است');
        this.storeStatus = true;

      } else if (data.status === false) {
        console.log('مغازه بسته است');
        this.storeStatus = false;
      }


      if (data['transaction_type'] === 'buy') {
        this.updateBuyPrice.set(data['price']);
      }
      if (data['transaction_type'] === 'sell') {
        this.updateSellPrice.set(data['price']);
      }
    });

    this.wsService.getLatestStoreStatus(this.sellerId)
      .subscribe((response: any) => {
        console.log("status in customer tab2 is: ", response.is_open);
        this.storeStatus = response.is_open;
      });

    this.wsService.getPriceUpdates().subscribe((newPrice) => {
      console.log("receive price is: ", newPrice)
      this.latestChangePrice()
    });

  }


  doRefresh(event: any) {
    console.log('Pull event detected. Refreshing...');

    this.getGoldPrice();

    setTimeout(() => {
      event.target.complete(); // اتمام انیمیشن رفرش
    }, 1000);
  }


  latestChangePrice() {
    this.sellerId = Number(localStorage.getItem('seller_id'));
    this.wsService.getLatestPrice(this.sellerId).subscribe((data: any) => {
      if (data) {
        // this.price = data.price;
        data.forEach((item: any) => {
          // console.log("item is:", item.transaction_type);
          if (item.transaction_type == 'buy') {
            this.latestChangeBuyPrice = item.price
          }
          if (item.transaction_type == 'sell') {
            this.latestChangeSellPrice = item.price
          }
        })
        console.log("latestChangeSellPrice is: ", this.latestChangeSellPrice);
        console.log("latestChangeBuyPrice is: ", this.latestChangeBuyPrice);
      }
    });

  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }

  customerSellers() {
    this.userservice.customerSellers()
      .pipe(
        catchError(error => {
          // console.error('Error:', error);
          // if (error?.error?.detail === "No Customer matches the given query.") {
          //   // this.changToSeller();
          // }
          return of([]); // مقدار پیش‌فرض برای ادامه اجرای برنامه
        })
      )
      .subscribe(response => {
        this.customerseller = response;
        console.log('customerseller:', this.customerseller);
      });

  }

  getUser() {
    this.userservice.getUser()
  }

  getSellerById() {
    this.sellerId = Number(localStorage.getItem('seller_id'));
    this.userservice.getSellerById(this.sellerId)
      .subscribe((res: any) => {
        console.log("seller is: ", res)
        this.seller_name = res.store_name;
      })
  }

  recived_id: string = "main-content1";

  async onTransactionSubmit() {
    this.createTransactionForm.value['seller_id'] = localStorage.getItem('seller_id')
    this.createTransactionForm.value['transaction_type'] = this.transactionType;

    // if (this.createTransactionForm.valid) {
    console.log("form is valid", this.createTransactionForm.value);
    const resultcreateTransaction = await this.userservice.createTransiction(this.createTransactionForm.value)
      .subscribe((result: any) => {
        console.log('createTransiction ....', result);
        // if (result.message) {
        //   this.router.navigate(['/login']);
        // }
      })
    // }
    if (this.createTransactionForm.invalid) {
      Object.keys(this.createTransactionForm.controls).forEach(field => {
        const control = this.createTransactionForm.get(field);
        control?.markAsTouched({onlySelf: true});
      });
      return;
    }

  }


  getPrice() {
    // this.ngOnInit();
    setInterval(() => {
      this.getGoldPrice();
    }, 30000);
  }

  getGoldPrice() {
    this.http.get(this.BASE_URL,).subscribe((data: any) => {
      this.gold_price2 = data;
      console.log("gold_price2 _______ ", this.gold_price2);
      if (this.gold_price2) {
        console.log("gold ------ ", this.gold_price2.gold[0], typeof (this.gold_price2.gold[0].price));
        this.date = this.gold_price2.gold[0];
        this.time = this.gold_price2.gold[0];
        this.buyPrice = this.gold_price2.gold[0].price;
      }

      this.sellPrice = this.buyPrice;
      // console.log("price is updated _____________");
    })
  };

  changePrice1(event: any) {
    const value = event.target.value;
    this.selectedPrice = value ? value * this.sellPrice + this.latestChangeBuyPrice : '';
    this.createTransactionForm.value['price'] = this.selectedPrice;
    this.createTransactionForm.value['weight'] = value;
  }

  changePrice(event: any) {
    const value = event.target.value;
    const basePrice = this.transactionType === 'buy'
      ? this.buyPrice + this.latestChangeBuyPrice
      : this.sellPrice + this.latestChangeSellPrice;
    this.selectedPrice = value ? value * basePrice : '';
    this.createTransactionForm.patchValue({
      price: this.selectedPrice,
      weight: value
    });
  }

  changeWeight(event: any) {
    const value = event.target.value;
    this.selectedWeight = value ? value / (this.sellPrice + this.latestChangeBuyPrice) : '';
    this.selectedWeight = this.selectedWeight.toFixed(3)
    this.createTransactionForm.value['weight'] = this.selectedWeight;
    this.createTransactionForm.value['price'] = value;

  }

  onChangeCustomerIdBySellerId(seller_id: any) {
    // console.log('seller_id', seller_id.target.value);
    localStorage.setItem('seller_id', seller_id.target.value)
  }

  cancel() {
    this.selectedPrice = '';
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    // console.log("i am in open modal");
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  // Alert Manager Function
  async presentAlert() {
    const alert = await this.alertController.create({
      header: "نتیجه جستجو",
      message: "موردی یافت نشد",
      buttons: ['متوجه شدم']
    });

    await alert.present();
  }


}

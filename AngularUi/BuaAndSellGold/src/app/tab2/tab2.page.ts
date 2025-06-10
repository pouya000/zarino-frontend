import {
  Component,
  inject,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  effect,
  HostListener
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonAvatar,
  IonButton,
  IonButtons,
  IonItem,
  IonImg,
  IonLabel,
  IonCol,
  IonGrid,
  IonRow,
  IonList,
  IonCard
} from '@ionic/angular/standalone';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {Router} from "@angular/router";
import {UserService} from "../sevices/user.service";
import {CommonModule, DecimalPipe} from '@angular/common';
import {environment} from "../../environments/environment";
import {OverlayEventDetail} from '@ionic/core/components';
import {goldPrice2} from "../models/goldPrice.interface";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {catchError, of} from "rxjs";
import {WebSocketService} from "../sevices/websocket.service";

// const BASE_URL = environment.GET_BASE_URL_GOLD;
// GET_BASE_URL_GOLD


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonAvatar,
    IonButton,
    IonButtons,
    IonItem,
    IonImg,
    IonLabel,
    IonList,
    IonCol,
    IonGrid,
    IonRow,
    IonCard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DecimalPipe]
})

export class Tab2Page implements OnInit {

  http = inject(HttpClient);

  constructor(private router: Router,
              private wsService: WebSocketService,
              private userservice: UserService,
              private fb: FormBuilder) {
    this.userservice.user$.subscribe(user => {
      if (user) {
        console.log("کاربر وارد شده در کانستراکتور تب2 :", user);
        // this.seller_name = user.last_name;
        this.latestChangePrice();
        // this.getGoldPrice()
      } else {
        console.log("کاربر احراز هویت نشده است.");
      }
    });

    // this.latestChangePrice();

    this.createTransactionForm = this.fb.group({
      "customer_id": [localStorage.getItem('customer_id'), Validators.required],
      "seller_id": [localStorage.getItem('seller_id'), Validators.required],
      "weight": ['', Validators.required],
      "price": ['', Validators.required],

    })
  }

  @ViewChild(IonModal) modal!: IonModal;

  BASE_URL: any;

  API_KEY_GOLD: any;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';

  name: string = '';

  gold_price2: goldPrice2 | null = null;

  sellPrice: number = 0;

  seller_name: string = '';

  buyPrice: number = 0;

  updateSellPrice: number = 0;

  updateBuyPrice: number = 0;

  latestChangeSellPrice: number = 0;

  // latestChangeBuyPrice = signal<number>(0);

  latestChangeBuyPrice: number = 0;

  newPrice: number | null = 2500;

  storeStatus: boolean = true;

  sellerId: number = Number(localStorage.getItem('seller_id'));

  selectedWeight: any;

  selectedPrice: any;

  customerseller: any;

  createTransactionForm: FormGroup;

  date: any;

  time: any;

  // ionViewWillEnter() {
  //   console.log("i am in ionViewWillEnter");
  //
  //   const currentUrl = this.router.url;
  //   sessionStorage.setItem('lastRoute', currentUrl);
  //   console.log('Tab2Page is about to enter');
  //   this.initPage();
  // }

  // initPage() {
  //   console.log("i am in initPage by  ionViewWillEnter");
  //   this.BASE_URL = this.userservice.GET_BASE_URL_GOLD;
  //   this.API_KEY_GOLD = this.userservice.API_KEY_GOLD;
  //   this.getGoldPrice();
  //   this.getPrice()
  //   this.latestChangePrice();
  //   this.webSocket();
  //   // this.sellerId = Number(localStorage.getItem('seller_id'));
  //
  //   // this.wsService.sendStoreStatus(this.sellerId,'close');
  // }

  installPrompt: any = null;

  // این تابع به رویداد 'beforeinstallprompt' که توسط مرورگر ارسال می‌شود، گوش می‌دهد
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    // جلوگیری از نمایش خودکار پنجره نصب توسط مرورگر
    event.preventDefault();

    // رویداد را در متغیر خود ذخیره می‌کنیم تا بعداً از آن استفاده کنیم
    this.installPrompt = event;
  }


  // این تابع زمانی که روی دکمه سفارشی ما کلیک شود، اجرا می‌شود
  installPwa(): void {
    if (!this.installPrompt) {
      console.log("i am in installPrompt")
      return;
    }

    // پنجره نصب مرورگر را به کاربر نمایش می‌دهیم
    this.installPrompt.prompt();

    // پس از نمایش، متغیر را خالی می‌کنیم چون این رویداد فقط یک بار قابل استفاده است
    this.installPrompt = null;
  }

  ngOnInit() {
    console.log("i am in tab 2 init ")

    this.BASE_URL = this.userservice.GET_BASE_URL_GOLD;

    this.API_KEY_GOLD = this.userservice.API_KEY_GOLD;

    this.getGoldPrice();

    this.getPrice();

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

    });

    this.wsService.getLatestStoreStatus(this.sellerId)
      .subscribe((response: any) => {
        console.log("status in customer tab2 is: ", response.is_open);
        this.storeStatus = response.is_open;
      });


    this.webSocket();

  }

  webSocket() {
    this.sellerId = Number(localStorage.getItem('seller_id'));
    console.log("sellerId in webSocket ------ ", this.sellerId);
    this.wsService.connect(this.sellerId);
  }

  latestStatusStore() {
    this.sellerId = Number(localStorage.getItem('seller_id'));
    this.wsService.getStoreStatusUpdates().subscribe((data: any) => {
      console.log("store status in seller page ------> ", data);
    })
  }

  latestChangePrice() {
    this.sellerId = Number(localStorage.getItem('seller_id'));
    console.log("sellerId in latestChangePrice ------ ", this.sellerId);
    this.wsService.getLatestPrice(this.sellerId).subscribe((data: any) => {
      if (data) {
        data.forEach((item: any) => {
          // console.log("item is:", item.transaction_type);
          if (item.transaction_type == 'buy') {
            this.latestChangeBuyPrice = item.price
          }
          if (item.transaction_type == 'sell') {
            this.latestChangeSellPrice = item.price;
          }
        })
        console.log("latestChangeSellPrice is: ", this.latestChangeSellPrice);
        console.log("latestChangeBuyPrice is: ", this.latestChangeBuyPrice);
      }
    });

  }

  updatePrice(transactionType: string) {
    const sellerId: number = Number(localStorage.getItem('seller_id'))
    if (transactionType == 'buy') {
      this.wsService.sendPrice(sellerId, this.updateBuyPrice, transactionType);
      this.latestChangePrice();
      this.updateBuyPrice = 0;
    }
    if (transactionType == 'sell') {
      this.wsService.sendPrice(sellerId, this.updateSellPrice, transactionType);
      this.latestChangePrice();
      this.updateSellPrice = 0;
    }
  }

  ngOnDestroy() {
    this.wsService.disconnect();
  }

  cancel() {
    this.selectedPrice = '';
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    console.log("i am in open modal");
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  // getUser() {
  //   this.userservice.getUser();
  // }

  getSellerById() {
    this.userservice.getSellerById(this.sellerId)
      .subscribe((res: any) => {
        console.log("seller is: ", res)
        this.seller_name = res.store_name;
      })
  }

  recived_id: string = "main-content1";

  async onTransactionSubmit() {
    this.createTransactionForm.value['seller_id'] = localStorage.getItem('seller_id')
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

  getGoldPrice() {
    this.http.get<goldPrice2>(this.BASE_URL).subscribe((data) => {
      this.gold_price2 = data;
      console.log("gold_price2 _______ ", this.gold_price2);
      this.date = this.gold_price2.gold[0];
      this.time = this.gold_price2.gold[0];
      // if (this.gold_price2 != null) {
      this.buyPrice = this.gold_price2.gold[0].price - this.updateBuyPrice;
      this.sellPrice = this.buyPrice;
      console.log("price is updated _____________");
      // }
    })
  };

  getPrice() {
    setInterval(() => {
      this.getGoldPrice();
    }, 30000);
  }

  addToPrice(item: string) {
    if (item === 'buy') {
      this.updateBuyPrice += 1000;
    }
    if (item === 'sell') {
      this.updateSellPrice += 1000;
    }
    // effect(() => {
    //   console.log('قیمت جدید:', this.latestChangeBuyPrice());
    // });
    console.log('updateBuyPrice .... ', this.updateBuyPrice);
    console.log('new sell +++ .... ', this.updateSellPrice);
  };

  minusToPrice(item: string) {
    if (item === 'buy') {
      this.updateBuyPrice -= 1000;
    }
    if (item === 'sell') {
      this.updateSellPrice -= 1000;
    }

    console.log('updateBuyPrice --- .... ', this.updateBuyPrice);
    console.log('new sell --- .... ', this.updateSellPrice);
  }

  changePrice(event: any) {
    const value = event.target.value;
    this.selectedPrice = value ? value * 7000000 : '';
    this.createTransactionForm.value['price'] = this.selectedPrice;
    this.createTransactionForm.value['weight'] = value;

  }

  changeWeight(event: any) {
    const value = event.target.value;
    this.selectedWeight = value ? value / 7000000 : '';
    this.createTransactionForm.value['weight'] = this.selectedWeight;
    this.createTransactionForm.value['price'] = value;
  }

  // changePrice(event: any) {
  //   const weight = event.target.value;
  //   this.createTransactionForm.patchValue({
  //     weight: weight,
  //     price: weight ? weight * 7000000 : 0
  //   });
  // }
  //
  // changeWeight(event: any) {
  //   const price = event.target.value;
  //   this.createTransactionForm.patchValue({
  //     price: price,
  //     weight: price ? price / 7000000 : 0
  //   });
  // }

  onChangeCustomerIdBySellerId(seller_id: any) {
    console.log('seller_id', seller_id.target.value);
    localStorage.setItem('seller_id', seller_id.target.value)
  }


}






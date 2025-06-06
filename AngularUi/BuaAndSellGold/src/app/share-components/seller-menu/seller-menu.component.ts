import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
// import {MenuController} from '@ionic/angular';
import {
  IonApp, IonRouterOutlet, IonIcon, IonMenu,
  IonContent, IonLabel, IonButton, IonList,
  IonItem, IonHeader, IonToolbar, IonTitle,
  IonSplitPane, IonToggle, MenuController
} from '@ionic/angular/standalone';
import {Router, RouterModule} from "@angular/router";
import {UserService} from "../../sevices/user.service";
import {WebSocketService} from "../../sevices/websocket.service";

@Component({
  selector: 'app-seller-menu',
  templateUrl: './seller-menu.component.html',
  styleUrls: ['./seller-menu.component.scss'],
  imports: [IonApp, IonRouterOutlet, RouterModule, IonSplitPane, IonTitle, IonToolbar, IonHeader, IonIcon, IonToggle,
    IonMenu, IonContent, IonLabel, IonIcon, IonButton, IonList, IonItem]
})
export class SellerMenuComponent implements OnInit, AfterViewInit {

  constructor(private userservice: UserService,
              private menuCtrl: MenuController,
              private wsService: WebSocketService,
              private router: Router) {

    this.sellerId = Number(localStorage.getItem('seller_id'));

    this.conectWs();
    // this.checkLoginStatus();
  }

  @ViewChild('storeToggle', {static: false}) storeToggle!: IonToggle;

  // sellerId: any;

  sellerId = Number(localStorage.getItem('seller_id'));


  storeStatus: boolean = true;

  ngAfterViewInit() {
    // تنظیم مقدار اولیه
    // this.storeToggle.checked = true;
  }

  ngOnInit() {

    this.sellerId = Number(localStorage.getItem('seller_id'));


    this.userservice.user$.subscribe((returnStatusUser: any) => {
      console.log("return StatusUser in seller-menu: ", returnStatusUser);
      this.receive_user.firstName = returnStatusUser.first_name;
      this.receive_user.address = returnStatusUser.address;
    })

    this.wsService.getLatestStoreStatus(this.sellerId)
      .subscribe((response: any) => {
        console.log("status in customer tab2 is: ", response.is_open);
        this.storeStatus = response.is_open;
      });


  }

  conectWs() {
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
  }

  onToggleChange(event: any) {
    const isChecked = event.detail.checked;
    let storestatus: string = 'open';

    if (isChecked === false) {
      storestatus = 'close'
    } else if (isChecked === true) {
      storestatus = 'open'
    }
    this.sellerId = Number(localStorage.getItem('seller_id'));
    console.log('Toggle وضعیت:', isChecked); // true یا false
    console.log('sellerId:', this.sellerId); // true یا false

    this.wsService.sendStoreStatus(this.sellerId, isChecked);
  }


  receive_user = {
    'firstName': '',
    'address': ''
  };

  closeIonButton() {
    this.menuCtrl.close('start')   // 'end' نام سمتی‌ست که در <ion-menu side="end"> دادید
      .then(() => {
      });
  }

  logout() {
    this.userservice.logout()
      .subscribe((response: any) => {
        console.log('res og logout: ', response);
        localStorage.removeItem('customer_id');
        localStorage.removeItem('seller_id');
        this.menuCtrl.close('end')   // 'end' نام سمتی‌ست که در <ion-menu side="end"> دادید
          .then(() => {
            console.log('xxxxxxxxx: ');

            // بعد از بستن منو، کار هدایت به صفحه لاگین را انجام بده:
            this.router.navigate(['/login']);
          });
        // this.router.navigate(['/login']);
      });


  }


}

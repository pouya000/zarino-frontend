import {Component, OnInit} from '@angular/core';
import {UserService} from "../../sevices/user.service";
import {Router, RouterModule} from "@angular/router";
import {
  IonApp, IonButton, IonContent,
  IonHeader,
  IonIcon, IonItem, IonLabel, IonList, IonMenu,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar, MenuController
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-customer-menu',
  templateUrl: './customer-menu.component.html',
  styleUrls: ['./customer-menu.component.scss'],
  imports: [IonApp, IonRouterOutlet, RouterModule, IonSplitPane, IonTitle, IonToolbar, IonHeader, IonIcon,
    IonMenu, IonContent, IonLabel, IonIcon, IonButton, IonList, IonItem]
})
export class CustomerMenuComponent implements OnInit {

  constructor(private userservice: UserService,
              private router: Router,
              private menuCtrl: MenuController,) {
    this.checkUserStatus();
  }


  receive_user = {
    'firstName': '',
    'address': ''
  };


  ngOnInit() {

    this.checkUserStatus();

  }

  checkUserStatus() {
    this.userservice.user$.subscribe((returnStatusUser: any) => {
      console.log("return StatusUser in customer-menu: ", returnStatusUser);
      this.receive_user.firstName = returnStatusUser.first_name;
      this.receive_user.address = returnStatusUser.address;
    })
  }

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
        this.router.navigate(['/login']);
        this.menuCtrl.close('start')   // 'end' نام سمتی‌ست که در <ion-menu side="end"> دادید
          .then(() => {
            // بعد از بستن منو، کار هدایت به صفحه لاگین را انجام بده:
            this.router.navigate(['/login']);
          });
      });
  }


}

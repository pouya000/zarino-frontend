import {Component, OnInit} from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonIcon, IonMenu,
  IonContent, IonLabel, IonButton, IonList,
  IonItem, IonHeader, IonToolbar, IonTitle,
  IonSplitPane
} from '@ionic/angular/standalone';
import {Router, RouterModule} from "@angular/router";
import {UserService} from "../../sevices/user.service";

@Component({
  selector: 'app-seller-menu',
  templateUrl: './seller-menu.component.html',
  styleUrls: ['./seller-menu.component.scss'],
  imports: [IonApp, IonRouterOutlet, RouterModule, IonSplitPane, IonTitle, IonToolbar, IonHeader, IonIcon,
    IonMenu, IonContent, IonLabel, IonIcon, IonButton, IonList, IonItem]
})
export class SellerMenuComponent implements OnInit {

  constructor(private userservice: UserService, private router: Router) {
    // this.checkLoginStatus();
  }

  ngOnInit() {
  }


  logout() {
    this.userservice.logout()
      .subscribe((response: any) => {
        console.log('res og logout: ', response);
        localStorage.removeItem('customer_id');
        localStorage.removeItem('seller_id');
        this.router.navigate(['/login']);
      });


  }


}

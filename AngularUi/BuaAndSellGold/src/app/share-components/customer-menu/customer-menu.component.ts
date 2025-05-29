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
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-customer-menu',
  templateUrl: './customer-menu.component.html',
  styleUrls: ['./customer-menu.component.scss'],
  imports: [IonApp, IonRouterOutlet, RouterModule, IonSplitPane, IonTitle, IonToolbar, IonHeader, IonIcon,
    IonMenu, IonContent, IonLabel, IonIcon, IonButton, IonList, IonItem]
})
export class CustomerMenuComponent implements OnInit {

  constructor(private userservice: UserService, private router: Router) {
    // this.checkLoginStatus();
  }


  receive_user = {
    'firstName': '',
    'address': ''
  };


  ngOnInit() {

    this.userservice.user$.subscribe((returnStatusUser: any) => {
      console.log("returnStatusUser: ", returnStatusUser);
      this.receive_user.firstName = returnStatusUser.first_name;
      this.receive_user.address = returnStatusUser.address;
    })

    // this.userservice.checkAuthStatus().subscribe((user: any) => {
    //   console.log("userrrrrrr2222: ", user);
    //   this.receive_user.firstName = user.first_name;
    //   this.receive_user.address = user.address;
    // });

    // this.userservice.checkAuthStatus().subscribe((user: any) => {
    //   console.log("data in customer menu is: ", user);
    //   this.receive_user.firstName = user.first_name;
    //   this.receive_user.address = user.address;
    // })
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

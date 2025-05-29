import {Component, inject, OnInit} from '@angular/core';
import {
  IonApp, IonRouterOutlet, IonIcon, IonMenu,
  IonContent, IonLabel, IonButton, IonList,
  IonItem, IonHeader, IonToolbar, IonTitle,
  IonSplitPane
} from '@ionic/angular/standalone';
import {Router, RouterModule} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {register} from 'swiper/element/bundle';
import {SellerMenuComponent} from "./share-components/seller-menu/seller-menu.component";
import {CommonModule} from "@angular/common";
import {CustomerMenuComponent} from "./share-components/customer-menu/customer-menu.component";
import {UserService} from "./sevices/user.service";
import {LastRouteService} from "./sevices/last-route.service";
import {NavController} from '@ionic/angular';

register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [SellerMenuComponent, CustomerMenuComponent, CommonModule, IonApp, IonRouterOutlet, RouterModule, IonSplitPane, IonTitle, IonToolbar, IonHeader, IonIcon,
    IonMenu, IonContent, IonLabel, IonIcon, IonButton, IonList, IonItem]
})
export class AppComponent implements OnInit {

  http = inject(HttpClient);

  constructor(private userservice: UserService,
              private navCtrl: NavController,
              private router: Router,
              private lastRouteService: LastRouteService) {
  }

  userType: string = '';

  showMenu = true;

  receive_user: any;


  ngOnInit(): void {

    this.userservice.userSubject.subscribe((user) => {
      if (user) {
        this.userType = user['user_type'];
        this.receive_user = user.first_name;
      } else {
        this.userType = '';
        this.receive_user = '';
      }
    });


    this.userservice.checkAuthStatus().subscribe((user: any) => {
      console.log("data is: ", user);
      if (user) {
        this.userType = user['user_type'];

        const lastRoute = this.lastRouteService.getLastRoute();
        console.log("last route ------> ", lastRoute)
        if (lastRoute && (lastRoute.includes('/seller/') || lastRoute.includes('/customer-tabs/'))) {
          this.navCtrl.navigateRoot(lastRoute);

          // this.router.navigateByUrl(lastRoute);
        } else {
          if (user.user_type == 'customer') {
            this.navCtrl.navigateRoot('/customer-tabs');
          } else if (user.user_type == 'seller') {
            this.navCtrl.navigateRoot('/seller');
          }
        }


        console.log('isLoggedInSubject is: ', this.userservice.isLoggedInSubject.getValue());
        this.receive_user = user.first_name;
      }
    });


    const menu_items = document.querySelector('.menu-items')?.children;
    console.log("menu-items: ", menu_items);
    if (menu_items) {
      for (let i = 0; i < menu_items.length; i++) {
        menu_items[i].addEventListener('click', () => {
          console.log("menu-items is clicked ");

          for (let j = 0; j < menu_items.length; j++) {
            menu_items[j].classList.remove('active')
          }
          menu_items[i].classList.add('active');
        })
      }
    }
  }

  logout() {
    this.userservice.logout()
      .subscribe((response: any) => {
        console.log('res og logout: ', response);
        localStorage.removeItem('customer_id');
        localStorage.removeItem('seller_id');
        localStorage.removeItem('jwt');
        this.router.navigate(['/login']);
      });


  }


  checkLogin() {
    this.userservice.getUser().subscribe({
      next: (user) => {
        console.log('User is logged in:', user);
        // اینجا می‌تونی اطلاعات کاربر رو در یک سرویسی ذخیره کنی
      },
      error: (err) => {
        console.log('User is not authenticated');
        this.router.navigate(['/login']);
      }
    });

  }


  checkLoginStatus() {
    const token = localStorage.getItem('jwt');
    console.log("token in app.comonent is: ", token);
    // this.userservice.getUser();
    this.userservice.user$.subscribe(user => {
      console.log("userservice.user$: ", user);

      if (user) {
        console.log("کاربر app.component :", user['user_type']);
        this.receive_user = user.username
        // this.userType = user['user_type'];
        if (token && user['user_type'] === 'customer') {
          this.router.navigate(['/customer-tabs/customer-tab2']);
        }
        if (token && user['user_type'] === 'seller') {
          this.router.navigate(['seller/tabs/tab2']);
        }
        if (!token) {
          this.router.navigate(['/login']);
        }

      }


    });

  }
}

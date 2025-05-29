import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol, IonGrid} from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {UserService} from "../../../sevices/user.service";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {NavController} from "@ionic/angular";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRow, IonCol, IonGrid, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  http = inject(HttpClient);

  constructor(private router: Router,
              private navCtrl: NavController,
              private userservice: UserService,
              private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      "email": ['', [Validators.required]],
      "password": ['', [Validators.required]],
    })

    this.selectSellerForm = this.fb.group({
      "user_id": ['', [Validators.required]],
      "sellers": ['', [Validators.required]]
    })

  }

  baseUrl = environment.apiUrl

  loginForm: FormGroup;

  selectSellerForm: FormGroup;

  sellSeller: any;

  loginView: boolean = true;

  SelectSellerFirstTimeView: boolean = false;

  onSelectSellerNextTimeView: boolean = false;

  customerseller: any;

  sellers: any[] = [];

  sellersList: any[] = [];

  user_info: any[] = [];

  customerSellers() {
    this.userservice.customerSellers()
      .pipe(
        catchError(error => {
          // console.error('Error:', error);
          if (error?.error?.detail === "No Customer matches the given query.") {
            this.changToSellectSellerFirstForTime();
          }
          return of([]); // مقدار پیش‌فرض برای ادامه اجرای برنامه
        })
      )
      .subscribe(response => {
        this.customerseller = response;
        console.log('customerseller:', this.customerseller['sellers']?.length ?? 0);
      });

  }

  ngOnInit() {
  }

  checkAuthStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}`, {withCredentials: true})
  }


  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.userservice.login(this.loginForm.value)
        .subscribe((result: any) => {
            console.log('result[\'user\'] in login ....', result['user']);
            this.user_info.push(result.user);
            if (result.jwt && result['user']['user_type'] == 'seller') {
              localStorage.setItem('seller_id', result.user.seller_id);
              this.userservice.checkAuthStatus().subscribe((user: any) => {
                console.log("data is: ", user);
                this.userservice.userSubject.next(user);
              })
              // this.navCtrl.navigateRoot('/seller/tabs');
              setTimeout(() => {
                this.router.navigateByUrl('/seller');
              }, 1000)

            } else if (result.jwt && result['user']['user_type'] == 'customer') {
              this.userservice.checkAuthStatus().subscribe((user: any) => {
                console.log("data is: ", user);
                this.userservice.userSubject.next(user);
              })
              localStorage.setItem('customer_id', result.user.customer_id);
              this.getAllSellers();
              this.customerSellers();
              setTimeout(() => {
                if (this.customerseller['sellers']?.length > 0) {
                  this.router.navigate(['/login/choice-seller'], {queryParams: {status: 2}});
                } else {
                  this.router.navigate(['/login/choice-seller'], {queryParams: {status: 1}});
                }
              }, 1000)
            }
          }
        )
    }

  }


  onLoginSubmit3() {
    // this.goToApp();
    if (this.loginForm.valid) {
      this.userservice.login(this.loginForm.value)
        .subscribe((result: any) => {
          console.log('login ....', result['user']);

          this.user_info.push(result.user);

          if (result.jwt && result['user']['user_type'] == 'seller') {
            localStorage.setItem('jwt', result.jwt);
            localStorage.setItem('seller_id', result.user.seller_id);
            this.router.navigate(['/seller/tabs/tab2']);
          }

          if (result.jwt && result['user']['user_type'] == 'customer') {
            localStorage.setItem('jwt', result.jwt);
            localStorage.setItem('customer_id', result.user.customer_id);
            this.getAllSellers();

            // this.customerSellers();
            setTimeout(() => {
              if (this.customerseller['sellers']?.length > 0) {
                // this.changToSelectSellerNextTime();
                this.goToChoiceSeller()
              } else {
                this.changToSellectSellerFirstForTime();
              }
            }, 1000)
          }
        })

      // this.userservice.getUser();
    }
    //
  }


  onLoginSubmit2() {
    // this.goToApp();
    if (this.loginForm.valid) {
      // const resultLogin = await this.userservice.login(this.loginForm.value)
      this.http.post('http://192.168.1.11:8000/api/login', this.loginForm.value)
        .subscribe({
          next: (result: any) => {
            this.user_info.push(result.user);

            if (result.jwt && result['user']['user_type'] == 'seller') {
              localStorage.setItem('jwt', result.jwt);
              localStorage.setItem('seller_id', result.user.seller_id);
              this.router.navigate(['/seller/tabs/tab2']);
            }

            if (result.jwt && result['user']['user_type'] == 'customer') {
              localStorage.setItem('jwt', result.jwt);
              localStorage.setItem('customer_id', result.user.customer_id);
              this.getAllSellers();
              this.customerSellers();
              setTimeout(() => {
                if (this.customerseller['sellers']?.length > 0) {
                  this.changToSelectSellerNextTime()
                } else {
                  this.changToSellectSellerFirstForTime();
                }
              }, 1000)
            }

            console.log('Success', result);
          },
          error: (err) => {
            console.log('Error1', err);
            console.log('Error2', JSON.stringify(err));
            console.log('Status:', err.status);
            console.log('Message:', err.message);
            console.log('Error Body:', err.error);
            console.log('Full Error:', err);

          }
        })
    }

  }


  onSelectSellerFirstTimeSubmit() {
    // if (this.selectSellerForm.valid) {
    console.log("User Info in select seller:", this.user_info);
    this.selectSellerForm.value['user_id'] = this.user_info[0]['id'];

    console.log("form is valid", this.selectSellerForm.value);
    this.userservice.createCustomer(this.selectSellerForm.value).subscribe(
      (response: any) => {
        console.log('Customer created successfully', response['id']);
        localStorage.setItem('customer_id', response['id']);
      },
      error => {
        console.error('Error creating customer', error);
      }
    );

    this.router.navigate(['/customer-tabs/customer-tab2']);

    // }
  }

  onSelectedSellersChange(seller_id: any) {
    console.log('seller_id', seller_id.target.value);
    this.sellSeller = seller_id.target.value;
    localStorage.setItem('seller_id', this.sellSeller);
    this.sellers.push(seller_id.target.value);
    this.selectSellerForm.value['sellers'] = this.sellers;
  }

  onSelectedCustomerSellersChange(seller_id: any) {
    console.log('seller_id', seller_id.target.value);
    this.sellSeller = seller_id.target.value;
    localStorage.setItem('seller_id', this.sellSeller);
  }

  changToSellectSellerFirstForTime() {
    this.loginView = false;
    this.SelectSellerFirstTimeView = true;
  }

  changToSelectSellerNextTime() {
    this.loginView = false;
    this.SelectSellerFirstTimeView = false;
    this.onSelectSellerNextTimeView = true;
  }

  getAllSellers() {
    this.userservice.getAllSellers().subscribe((response: any) => {
      console.log("get sellers is ... ", response);
      this.sellersList = response;
    })
  }

  goToApp() {
    this.router.navigate(['/customer-tabs/customer-tab2']);
  }

  goToChoiceSeller() {
    this.router.navigate(['/choice-seller']);
  }
}

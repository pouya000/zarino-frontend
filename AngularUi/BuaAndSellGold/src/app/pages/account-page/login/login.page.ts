import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonGrid,
  IonSpinner
} from '@ionic/angular/standalone';
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../../sevices/user.service";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import { finalize } from 'rxjs/operators';
import {NavController} from "@ionic/angular";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader,IonSpinner, IonTitle, IonToolbar, RouterLink, CommonModule, FormsModule, IonRow, IonCol, IonGrid, ReactiveFormsModule]
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

  isLoading = false;

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

  // checkAuthStatus(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}`, {withCredentials: true})
  // }


  onLoginSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false; // ۲. پس از دریافت پاسخ، وضعیت لودینگ را غیرفعال کنید
      }, 2000);

      this.userservice.login(this.loginForm.value).pipe(
        finalize(() => {
          // این بلاک همیشه اجرا می‌شود، چه موفقیت‌آمیز باشد چه با خطا
          this.isLoading = false;
        })
      )
        .subscribe((result: any) => {
            console.log('result[\'user\'] in login ....', result['user']);
            this.user_info.push(result.user);
            if (result['user']['user_type'] == 'seller') {
              localStorage.setItem('seller_id', result.user.seller_id);
              this.userservice.checkAuthStatus().subscribe((user: any) => {
                console.log("checkAuthStatus in login: ", user);
                this.userservice.userSubject.next(user);
              })
              // this.navCtrl.navigateRoot('/seller/tabs');
              setTimeout(() => {
                this.router.navigateByUrl('/seller');
              }, 1000)

            } else if (result['user']['user_type'] == 'customer') {
              this.userservice.checkAuthStatus().subscribe((user: any) => {
                console.log("checkAuthStatus in login: ", user);
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

  changeToRegister() {


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

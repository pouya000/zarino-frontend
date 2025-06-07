import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../sevices/user.service";
import {IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {CommonModule} from "@angular/common";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-choice-seller',
  templateUrl: './choice-seller.component.html',
  styleUrls: ['./choice-seller.component.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRow, IonCol, IonGrid, ReactiveFormsModule]

})
export class ChoiceSellerComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userservice: UserService,
              private fb: FormBuilder) {

    this.selectSellerForm = this.fb.group({
      "user_id": ['', [Validators.required]],
      "sellers": ['', [Validators.required]]
    })

  }

  selectSellerForm: FormGroup;

  sellersList: any[] = [];

  sellers: any[] = [];

  sellSeller: any;

  customerseller: any;

  user_info: any;

  user_info2: any[] = [];


  SelectSellerFirstTimeView: boolean = false;

  onSelectSellerNextTimeView: boolean = false;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const status = +params['status']; // تبدیل به عدد
      if (status === 1) {
        console.log('کاربر برای اولین بار وارد شده');
        this.SelectSellerFirstTimeView = true;


      } else if (status === 2) {
        console.log('کاربر قبلاً فروشنده داشته');
        this.onSelectSellerNextTimeView = true;

      }
    });

    this.userservice.user$.subscribe((data: any) => {
      console.log("userservice.user$ in choice-seller: ", data);
      this.user_info = data;
      console.log("user_info2 in choice-seller: ", this.user_info);
    })

    this.getAllSellers();

    this.customerSellers();
  }

  getAllSellers() {
    this.userservice.getAllSellers().subscribe((response: any) => {
      console.log("All sellers is ... ", response);
      this.sellersList = response;
    })
  }

  customerSellers() {
    this.userservice.customerSellers()
      .pipe(
        catchError(error => {
          // console.error('Error:', error);
          if (error?.error?.detail === "No Customer matches the given query.") {
            // this.changToSellectSellerFirstForTime();
            console.log("No Customer matches the given query")
          }
          return of([]); // مقدار پیش‌فرض برای ادامه اجرای برنامه
        })
      )
      .subscribe(response => {
        this.customerseller = response;
        console.log('customerseller:', this.customerseller);

        console.log('customerseller:', this.customerseller['sellers']?.length ?? 0);
      });

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


  onSelectSellerFirstTimeSubmit() {
    // if (this.selectSellerForm.valid) {
    console.log("User Info in select seller:", this.user_info);
    console.log("selectSellerForm:", this.selectSellerForm.value);

    this.selectSellerForm.value['user_id'] = this.user_info['id'];

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

  onSelectSellerSecondTimeSubmit() {

  }

  goToApp() {
    this.router.navigate(['/customer-tabs/customer-tab2']);
    console.log('i am in go to app');

  }

}

import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../sevices/user.service";
import {HttpClient} from "@angular/common/http";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonModal,
  IonRouterOutlet,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {CommonModule} from "@angular/common";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-change-seller',
  templateUrl: './change-seller.component.html',
  styleUrls: ['./change-seller.component.scss'],
  imports: [
    IonGrid, IonCol, IonRow, ReactiveFormsModule,
    IonAvatar, IonCardContent, IonCardSubtitle, CommonModule,
    IonCardTitle, IonCardHeader, IonCard, IonListHeader,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonMenu,
    IonLabel,
    IonButton,
    IonItem,
    IonList,
    IonIcon,
    IonSearchbar,
    IonBackButton,
    IonModal,
    IonRouterOutlet
  ],
  standalone: true,

})
export class ChangeSellerComponent implements OnInit {

  http = inject(HttpClient);

  constructor(
    private userservice: UserService,
    private fb: FormBuilder) {

    this.userservice.user$.subscribe(user => {
      if (user) {
        console.log("کاربر وارد شده:", user);
        this.user_id = user.id;
        // console.log("user_id is ... ", this.user_id);
      } else {
        console.log("کاربر احراز هویت نشده است.");
      }
    });

    this.changeSellerForm = this.fb.group({
      "user_id": ['', [Validators.required]],
      "seller_id": ['', [Validators.required]],
    })
  }

  changeSellerForm: FormGroup;

  customerseller: any;

  sellersList: any[] = [];

  user_id: any;

  ngOnInit() {
    this.customerSellers();
  }

  onChangeSellerSubmit() {
    console.log("form is : ", this.changeSellerForm.value)
    this.http.post("http://localhost:8000/api/add-seller-to-customer", this.changeSellerForm.value).subscribe((res: any) => {
      console.log("is add seller to cus ... ", res)
    })
  }

  onSelectedSellersChange(seller_id: any) {
    localStorage.setItem('seller_id', seller_id.target.value)
    this.changeSellerForm.value['seller_id'] = seller_id.target.value;
    this.changeSellerForm.value['user_id'] = this.user_id;
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

}

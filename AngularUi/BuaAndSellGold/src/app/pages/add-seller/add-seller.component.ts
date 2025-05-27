import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {
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
  IonRouterOutlet,
  IonListHeader,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonRow,
  IonCol,
  IonGrid
} from '@ionic/angular/standalone';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../sevices/user.service";


@Component({
  selector: 'app-add-seller',
  templateUrl: './add-seller.component.html',
  styleUrls: ['./add-seller.component.scss'],
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
export class AddSellerComponent implements OnInit {

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

    this.addSellerForm = this.fb.group({
      "user_id": ['', [Validators.required]],
      "seller_id": ['', [Validators.required]],
    })
  }

  addSellerForm: FormGroup;

  sellersList: any[] = [];

  user_id: any;

  ngOnInit() {
    this.getSellers();
  }

  onAddSellerSubmit() {
    console.log("form is : ", this.addSellerForm.value)
    this.http.post("http://localhost:8000/api/add-seller-to-customer", this.addSellerForm.value).subscribe((res: any) => {
      console.log("is add seller to cus ... ", res)
    })
  }

  getSellers() {
    this.userservice.getAllSellers().subscribe((response: any) => {
      console.log("get sellers is ... ", response);
      this.sellersList = response;
    })
  }

  addSellerToCustomerSubmit() {
    // const customer_data = this.selectSellerForm.value;
    const customer_data = {
      "user_id": 37,
      "seller_id": 5
    }
    this.http.post("http://localhost:8000/api/add-seller-to-customer", customer_data).subscribe((res: any) => {
      console.log("is add seller to cus ... ", res)
    })
  }

  onSelectedSellersChange(seller_id: any) {
    this.addSellerForm.value['seller_id'] = seller_id.target.value;
    this.addSellerForm.value['user_id'] = this.user_id;
  }

}

import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonSpinner,
  IonToolbar,
  IonSelectOption,
  IonRow,
  IonCol,
  IonGrid, IonItem, IonInput, IonRadioGroup, IonLabel, IonRadio, IonButton
} from '@ionic/angular/standalone';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../../../sevices/user.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonSpinner, IonButton, IonInput, IonLabel, IonRadioGroup, IonRadio, IonSelectOption, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRow, IonCol, IonGrid, ReactiveFormsModule]
})

export class RegisterPage implements OnInit {

  private http = inject(HttpClient);

  constructor(private router: Router,
              private userservice: UserService,
              private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      "username": ['', [Validators.required]],
      "email": ['', Validators.required],
      // "mobile": ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      "password": ['', [Validators.required, Validators.maxLength(6)]],
      "address": ['', Validators.required],
      "user_type": ['seller', Validators.required]
    })
  }


  registerView: boolean = false;

  sellerView: boolean = false;

  user_type = [
    {id: '1', name: 'فروشنده', user_type: 'seller'},
    {id: '2', name: 'مشتری', user_type: 'customer'},
  ];


  ngOnInit() {

  }

  registerForm: FormGroup;

  isLoading = false;

  resLogin: boolean = false;

  user_info: any[] = [];

  checkType(selectedType: string) {
    console.log("selectedType is ... ", selectedType)

    this.registerForm.value['user_type'] = selectedType;
    console.log("this.registerForm.value is ... ", this.registerForm.value)
  }


  async onRegisterSubmit() {
    if (this.registerForm.valid) {

      console.log("form is valid", this.registerForm.value);

      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false; // ۲. پس از دریافت پاسخ، وضعیت لودینگ را غیرفعال کنید
      }, 2000);
      const resultRegister = await this.userservice.register(this.registerForm.value).pipe(
        finalize(() => {
          // این بلاک همیشه اجرا می‌شود، چه موفقیت‌آمیز باشد چه با خطا
          this.isLoading = false;
        })
      ).subscribe((result: any) => {
        console.log('registerr ....', result);
        // if (result.message) {
        //   this.router.navigate(['/login']);
        // }
      })
      this.router.navigate(['/login']);
      // this.changToLogin();
    }
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        control?.markAsTouched({onlySelf: true});
      });
      return;
    }
  }


  // changToRegister() {
  //   this.loginView = false
  //   this.sellerView = false;
  //   this.registerView = true
  // }
  //
  // changToLogin() {
  //   this.registerView = false;
  //   this.sellerView = false;
  //   this.loginView = true;
  // }
  //


  goToApp() {
    this.router.navigate(['/tabs/tab1']);
  }


}


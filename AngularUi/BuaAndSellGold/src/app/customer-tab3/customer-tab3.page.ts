import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonModal} from '@ionic/angular/standalone';
import {IDatepickerTheme, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {Jalali} from "jalali-ts";
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserService} from "../sevices/user.service";
import {AlertController} from "@ionic/angular";


@Component({
  selector: 'app-customer-tab3',
  templateUrl: './customer-tab3.page.html',
  styleUrls: ['./customer-tab3.page.scss'],
  standalone: true,
  imports: [
    NgPersianDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule, IonContent, IonHeader, IonModal, IonTitle, IonToolbar, IonButton,
    IonButtons, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerTab3Page implements OnInit {

  http = inject(HttpClient);


  constructor(private userservice: UserService, private alertController: AlertController) {

  }

  selectedDate: any;

  dateValue = new FormControl();

  isSearchByDate: boolean = false;

  isSearchTotal: boolean = false;

  allTransactionsByDate: any[] = [];

  allTransactionsByName: any[] = [];

  allTransactions: any[] = [];

  receive_user: any;

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.userservice.user$.subscribe(user => {
      if (user) {
        console.log("کاربر وارد شده:", user);
        this.receive_user = user.first_name;
        console.log("receive_user in customer tab 3: ", this.receive_user)
      } else {
        console.log("کاربر احراز هویت نشده است.");
      }
    });

  }

  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#D68E3A',
    selectedText: '#FFFFFF',
    // background: '#222222'
  };

  onSelect(date: any) {
    const seller_id = Number(localStorage.getItem('seller_id'));
    // console.log("dateValue is : ", this.dateValue);
    console.log("date is : ", date);
    this.selectedDate = date;
    console.log("this.selectedDate: ", this.selectedDate);
    const myjalali = Jalali.parse(date.shamsi);
    console.log("transformed date is : ", myjalali.gregorian());
    // const [year, month, day] = (date.shamsi).split('/').map(Number); // تبدیل تاریخ شمسی به عدد
    // const jalaliObj = new Jalali(year, month, day); // ایجاد یک نمونه از Jalali
    // const gregorianDate = jalaliObj.toDate(); // تبدیل تاریخ شمسی به میلادی
    // const { gy, gm, gd } = toGregorian(year, month, day); // تبدیل به میلادی
    this.getTransactions(seller_id, this.receive_user, myjalali.gregorian())
    this.isSearchByDate = true;
  }

  // Alert Manager Function
  async presentAlert() {
    const alert = await this.alertController.create({
      header: "نتیجه جستجو",
      message: "موردی یافت نشد",
      buttons: ['متوجه شدم']
    });

    await alert.present();
  }


  convertToJalaliWithTime(date: string): { jalaliDate: string, jalaliTime: string } {
    const miladiDate = new Date(date);
    const jalaliDate = new Jalali(miladiDate);
    // استخراج ساعت و دقیقه
    const hours = miladiDate.getHours().toString().padStart(2, '0'); // دو رقمی کردن
    const minutes = miladiDate.getMinutes().toString().padStart(2, '0');
    const seconds = miladiDate.getSeconds().toString().padStart(2, '0');

    console.log("convertToJalaliWithTime is: ", `${jalaliDate.toString()} ${miladiDate.getHours()}:${miladiDate.getMinutes()}`)
    // return `${jalaliDate.toString()}`;
    const formattedDate = jalaliDate.toString().split(' ')[0]; // جدا کردن تاریخ از زمان
    return {
      jalaliDate: formattedDate,
      jalaliTime: `${hours}:${minutes}:${seconds}`
    }
  }


  getTransactions(sellerId: number, customerName: string, transactionDate: string) {
    const params = new HttpParams()
      .set('seller_id', sellerId)
      .set('customer_name', customerName || '')
      .set('transaction_date', transactionDate || '');
    return this.http.get('http://localhost:8000/api/transactions/search', {params})
      .subscribe((res: any) => {
        console.log('allTransactions search:', res);
        if (res.length == 0) {
          console.log("res is emptyyyyyyyyyyy");
          this.presentAlert();
        }

        if (customerName.length > 1) {
          this.allTransactionsByName = res;
          console.log('allTransactionsByName:', this.allTransactionsByName);
          this.allTransactionsByName.forEach((item) => {
            console.log("items in allTransactionsByName: ", this.convertToJalaliWithTime(item.date));
            // item.date = this.convertToJalaliWithTime(item.date);
            const {jalaliDate, jalaliTime} = this.convertToJalaliWithTime(item.date);
            item.jalaliDate = jalaliDate;
            item.jalaliTime = jalaliTime;
          })
        }

        if (transactionDate.length > 1) {
          this.allTransactionsByDate = res;
          console.log('allTransactionsByDate:', this.allTransactionsByDate);
          this.allTransactionsByDate.forEach((item) => {
            // console.log("items in allTransactions: ", this.convertToJalaliWithTime(item.date));
            // item.date = this.convertToJalaliWithTime(item.date);
            const {jalaliDate, jalaliTime} = this.convertToJalaliWithTime(item.date);
            item.jalaliDate = jalaliDate;
            item.jalaliTime = jalaliTime;
          })
        }

      });
  }


  allTransaction() {
    this.setOpen(true)
    const seller_id = Number(localStorage.getItem('seller_id'));

    const params = new HttpParams()
      .set('seller_id', seller_id)
      .set('customer_name', this.receive_user || '')
    return this.http.get('http://localhost:8000/api/transactions/search', {params})
      .subscribe((res: any) => {
        // console.log("result of total transactions: ", res);
        if (res.length > 0) {
          this.allTransactions = res;
          this.isSearchTotal = true;
          console.log('allTransactions:', this.allTransactions);
          this.allTransactions.forEach((item) => {
            console.log("items in allTransactions: ", this.convertToJalaliWithTime(item.date));
            // item.date = this.convertToJalaliWithTime(item.date);
            const {jalaliDate, jalaliTime} = this.convertToJalaliWithTime(item.date);
            item.jalaliDate = jalaliDate;
            item.jalaliTime = jalaliTime;
          })
        }

      })
  }

  isSearchByDateToggle() {
    this.isSearchByDate = false;
  }


}

import {Component, CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import {
  IonAlert,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonModal,
  IonAvatar,
  IonButton,
  IonButtons, IonItem, IonImg, IonLabel, IonList, IonDatetime, IonDatetimeButton,
} from '@ionic/angular/standalone';
import {ExploreContainerComponent} from '../explore-container/explore-container.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
// import {NgPersianDatepickerModule} from 'ng-persian-datepicker';
import {FormControl} from '@angular/forms';
import {Platform, AlertController} from '@ionic/angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {NgPersianDatepickerModule} from 'ng-persian-datepicker';
// import { DatepickerConfig } from 'ng-persian-datepicker';
import {IDatepickerTheme} from 'ng-persian-datepicker';
import {Jalali} from 'jalali-ts';
import {environment} from "../../environments/environment";


// export const darkTheme: IDatepickerTheme = {
//   border: '#393939',
//   timeBorder: '#393939',
//
//   background: '#222222',
//   text: '#FFFFFF',
//
//   hoverBackground: '#393939',
//   hoverText: '#FFFFFF',
//
//   disabledBackground: '#393939',
//   disabledText: '#CCCCCC',
//
//   selectedBackground: '#D68E3A',
//   selectedText: '#FFFFFF',
//
//   todayBackground: '#FFFFFF',
//   todayText: '#2D2D2D',
//
//   otherMonthBackground: 'rgba(0, 0, 0, 0)',
//   otherMonthText: '#CCCCCC'
// }

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    NgPersianDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IonDatetime,
    IonAlert,
    IonDatetimeButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonAvatar,
    IonButton,
    IonButtons,
    IonItem,
    IonImg,
    IonLabel,
    IonList
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class Tab3Page {

  http = inject(HttpClient);

  constructor(private platform: Platform, private alertController: AlertController) {
    this.updateSlidesPerView();
    this.platform.resize.subscribe(() => {
      this.updateSlidesPerView();
    });
  }


  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#D68E3A',
    selectedText: '#FFFFFF',
    // background: '#222222'
  };

  alertButtons = ['متوجه شدم'];

  updateSlidesPerView() {
    const width = this.platform.width();
    console.log("size screen ...", width);
    this.slidesPerView = width >= 768 ? 4 : 3;
    console.log("slidesPerView ...", this.slidesPerView);

  }

  baseUrl = environment.apiUrl

  dateValue = new FormControl();

  selectedDate: any;

  slidesPerView: number = 2;

  allTransactions: any[] = [];

  allTransactionsByDate: any[] = [];


  isSearchByName: boolean = false;

  isSearchByDate: boolean = false;

  today: Date = new Date(); // تاریخ امروز میلادی

  ngOnInit() {
    this.updateSlidesPerView();
    this.platform.resize.subscribe(() => {
      this.updateSlidesPerView();
    });
  }

  sliderOptions = {
    min: 0,
    max: 100,
    step: 1
  };

  items: Slide[] = [
    {id: 1, title: ' مهدی', description: ' 3 گرم', image: '../../assets/images/istockphoto5.jpg'},
    {id: 2, title: ' علی مشهدی', description: '2.700 گرم', image: '../../assets/images/istockphoto5 - Copy.jpg'},
    {id: 3, title: 'پویا شمسی', description: '40 گرم', image: '../assets/images/istockphoto6.jpg'},
    {id: 4, title: 'مینا صابری', description: ' 10.050 گرم', image: '../assets/images/istockphoto4.jpg'},
  ];

  onSelect(date: any) {
    this.isSearchByDate = false;
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
    this.getTransactions(seller_id, '', myjalali.gregorian())
    this.isSearchByDate = true;
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value;
    const seller_id = Number(localStorage.getItem('seller_id'));
    console.log("sellerId _______ ", seller_id);

    if (searchTerm && seller_id) {
      console.log('Search Term:', searchTerm);
      this.isSearchByName = true;
      this.getTransactions(seller_id, searchTerm, '')
    }
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


  getTransactions(sellerId: number, customerName: string, transactionDate: string) {
    const params = new HttpParams()
      .set('seller_id', sellerId)
      .set('customer_name', customerName || '')
      .set('transaction_date', transactionDate || '');
    return this.http.get(`${this.baseUrl}/transactions/search`, {params})
      .subscribe((res: any) => {
        console.log('allTransactions search:', res);
        if (res.length == 0) {
          console.log("res is emptyyyyyyyyyyy");
          this.presentAlert();
        }
        if (customerName.length > 1) {
          this.allTransactions = res;
          console.log('allTransactions:', this.allTransactions);
          this.allTransactions.forEach((item) => {
            console.log("items in allTransactions: ", this.convertToJalaliWithTime(item.date));
            const {jalaliDate, jalaliTime} = this.convertToJalaliWithTime(item.date);
            item.jalaliDate = jalaliDate;
            item.jalaliTime = jalaliTime;
          })
        }
        if (transactionDate.length > 1) {
          this.allTransactionsByDate = res;
          console.log('allTransactionsByDate:', this.allTransactionsByDate);
          this.allTransactionsByDate.forEach((item) => {
            const {jalaliDate, jalaliTime} = this.convertToJalaliWithTime(item.date);
            item.jalaliDate = jalaliDate;
            item.jalaliTime = jalaliTime;
          })
        }

      });
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

  isSearchToggle() {
    this.isSearchByName = false;
  }

  isSearchByDateToggle() {
    this.isSearchByDate = false;
  }


}


export interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

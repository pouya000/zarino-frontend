import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-customer-tab1',
  templateUrl: './customer-tab1.page.html',
  styleUrls: ['./customer-tab1.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, FormsModule]
})
export class CustomerTab1Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

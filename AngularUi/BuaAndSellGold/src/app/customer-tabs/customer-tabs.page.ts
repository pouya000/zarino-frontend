import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonTabs,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {home, people, person} from "ionicons/icons";

@Component({
  selector: 'app-customer-tabs',
  templateUrl: './customer-tabs.page.html',
  styleUrls: ['./customer-tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonContent, IonHeader, IonTitle, IonToolbar, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule, FormsModule]
})
export class CustomerTabsPage implements OnInit {

  constructor() {
    addIcons({person, home, people});
  }

  selectedTab: string = 'customer-tab2';

  selectedTabFunc(item: string) {
    this.selectedTab = item;
    console.log('تب انتخاب شده جدید:', this.selectedTab);
  }

  ngOnInit() {
  }

}

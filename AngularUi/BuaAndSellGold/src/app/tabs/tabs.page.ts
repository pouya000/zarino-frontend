import {Component, EnvironmentInjector, inject} from '@angular/core';
import {IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {triangle, ellipse, square, home, people, person} from 'ionicons/icons';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    // addIcons({ triangle, ellipse, square });
    addIcons({person, home, people});
  }

  selectedTab: string = 'tab2';

  selectedTabFunc(item: string) {
    this.selectedTab = item;
    console.log('تب انتخاب شده جدید:', this.selectedTab);
  }

  // ngOnChanges() {
  //   console.log('تب انتخاب شده جدید:', this.selectedTab);
  // }


}

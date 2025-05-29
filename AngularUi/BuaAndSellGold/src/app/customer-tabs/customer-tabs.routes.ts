import { Routes } from '@angular/router';
import { CustomerTabsPage } from './customer-tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: CustomerTabsPage,
    children: [
      {
        path: 'customer-tab1',
        loadComponent: () =>
          import('../customer-tab1/customer-tab1.page').then(m => m.CustomerTab1Page),
      },
      {
        path: 'customer-tab2',
        loadComponent: () =>
          import('../customer-tab2/customer-tab2.page').then(m => m.CustomerTab2Page),
      },
      {
        path: 'customer-tab3',
        loadComponent: () =>
          import('../customer-tab3/customer-tab3.page').then(m => m.CustomerTab3Page),
      },
      {
        path: '',
        redirectTo: 'customer-tab2',
        pathMatch: 'full',
      },
    ],
  },
];

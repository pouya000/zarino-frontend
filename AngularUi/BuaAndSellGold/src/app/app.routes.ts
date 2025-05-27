import {Routes} from '@angular/router';
import {AddSellerComponent} from "./pages/add-seller/add-seller.component";
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'seller',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'customer-tabs',
    loadChildren: () => import('./customer-tabs/customer-tabs.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/account-page/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/account-page/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'add-seller',
    loadComponent: () => import('./pages/add-seller/add-seller.component').then((m) => m.AddSellerComponent),
  },
  {
    path: 'change-seller',
    loadComponent: () => import('./pages/change-seller/change-seller.component').then((m) => m.ChangeSellerComponent),
  },
  {
    path: 'login/choice-seller',
    loadComponent: () => import('./pages/account-page/choice-seller/choice-seller.component').then((m) => m.ChoiceSellerComponent),
  },

  // {
  //   path: 'customer-tabs',
  //   loadComponent: () => import('./customer-tabs/customer-tabs.page').then(m => m.CustomerTabsPage),
  //   canActivate: [authGuard]
  // },

  {
    path: 'customer-tab1',
    loadComponent: () => import('./customer-tab1/customer-tab1.page').then(m => m.CustomerTab1Page)
  },
  {
    path: 'customer-tab2',
    loadComponent: () => import('./customer-tab2/customer-tab2.page').then(m => m.CustomerTab2Page),
    canActivate: [authGuard]
  },
  {
    path: 'customer-tab3',
    loadComponent: () => import('./customer-tab3/customer-tab3.page').then(m => m.CustomerTab3Page)
  }
];

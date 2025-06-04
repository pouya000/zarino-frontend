import {Injectable} from '@angular/core';
import {loginData} from '../models/goldPrice.interface';
import {registerData} from '../models/goldPrice.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject, catchError, delay, throwError, tap, of} from 'rxjs';

import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private router: Router) {
    console.log("base url: ", this.baseUrl)
  }

  public userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  // -----------------------------------------------
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  checkAuthStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user`, {withCredentials: true})
      .pipe(
        tap((user: any) => {
          this.isLoggedInSubject.next(true);
            this.userSubject.next(user);
          // console.log('isLoggedInSubject is: ', this.isLoggedInSubject.getValue());
          // console.log('userSubject is: ', this.userSubject.getValue());
          // if (this.userSubject.getValue().user_type == 'customer') {
          //   this.router.navigate(['/customer-tabs/customer-tab2']);
          // }
          // if (this.userSubject.getValue().user_type == 'seller') {
          //   this.router.navigate(['seller/tabs/tab2']);
          // }
          // this.isLoggedIn$.subscribe(value => {
          //   console.log('isLoggedIn$ VALUE is:', value);
          // });

        }),
        catchError(() => {
          this.isLoggedInSubject.next(false);
          this.userSubject.next(null);
          return of(null);
        })
      );
  }

// --------------------------------------------------------------

  API_KEY_GOLD = 'freej2vNlTDpSCNiIxUgNttprw9MAwgO'
  // GET_BASE_URL_GOLD = '/api/FreeTsetmcBourseApi/Api_Free_Gold_Currency.json'
  GET_BASE_URL_GOLD = 'https://BrsApi.ir/Api/Market/Gold_Currency.php?key=Free5QWBlEjF8JqkATyRKNg8Z6FPrkQU'

  baseUrl = environment.apiUrl

  public register(userRegisterData: registerData) {
    return this.http.post(`${this.baseUrl}/register`, userRegisterData)
  }

  // public getUser() {
  //   const token = localStorage.getItem('jwt');
  //
  //   if (!token) {
  //     console.error("No token found!");
  //     return;
  //   }
  //
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   console.log('token ', token)
  //
  //   return this.http.get(this.userUrl, {headers})
  // }

  // registerUser(userData: any) {
  //   return this.http.post('http://localhost:8000/register/', userData);
  // }

  // public login(userData: any) {
  //   return this.http.post(this.loginUrl, userData)
  // }

  public createCustomer(customerData: any) {
    return this.http.post(`${this.baseUrl}/create-customer`, customerData);
  }

  public createTransiction(transactionData: any) {
    return this.http.post(`${this.baseUrl}/create-transaction`, transactionData, {withCredentials: true})
  }

  public customerSellers() {
    return this.http.get(`${this.baseUrl}/customer-sellers`, {withCredentials: true})
  }

  public getUser() {
    return this.http.get(`${this.baseUrl}/user`, {withCredentials: true})
  }

  public getAllSellers() {
    return this.http.get(`${this.baseUrl}/sellers`, {withCredentials: true})
  }

  public getSellerById(seller_id: number) {
    console.log("seller id is: ", seller_id);
    return this.http.get(`${this.baseUrl}/seller/${seller_id}`, {withCredentials: true})
  }

  public login(userData: any) {
    return this.http.post(`${this.baseUrl}/login`, userData, {
      withCredentials: true
    })
  }

  // logout() {
  //   this.http.post(`${this.baseUrl}/logout`, {}, {withCredentials: true})
  //     .subscribe((res) => {
  //       console.log("res of log out ...", res);
  //       this.userSubject.next(null); // کاربر را از وضعیت خارج کن
  //       console.log("i am in log out ...");
  //     });
  // }


  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, {withCredentials: true})
  }


}

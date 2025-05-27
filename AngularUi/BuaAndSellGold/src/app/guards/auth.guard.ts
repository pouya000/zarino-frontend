import {CanActivateFn, Router} from '@angular/router';
import {catchError, of, map} from "rxjs";
import {UserService} from "../sevices/user.service";
import {FormBuilder} from "@angular/forms";
import {inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";

export const authGuard: CanActivateFn = (route, state) => {


  // const token = localStorage.getItem('jwt');
  // const router = new Router();
  // console.log("token in guards is: ", token);
  // if (token) {
  //   return true;
  // } else {
  //   router.navigate(['/login']);
  //   return false;
  // }


  const http = inject(HttpClient);
  const router = inject(Router);
  const baseUrl = "http://localhost:8000/api";

  return http.get(`${baseUrl}/user`, {withCredentials: true}).pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );

};

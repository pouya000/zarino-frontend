import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LastRouteService {
  private storageKey = 'lastRoute';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        sessionStorage.setItem(this.storageKey, event.urlAfterRedirects);
      });
  }

  getLastRoute(): string | null {
    return sessionStorage.getItem(this.storageKey);
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}

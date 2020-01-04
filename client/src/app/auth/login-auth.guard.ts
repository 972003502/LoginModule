import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiConfig } from '../settings/apiConfig';
import { TokenService } from '../services/token.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {
  constructor(
    private token: TokenService,
    private router: Router
  ) { }

  authApi = apiConfig.authApi;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.token.redirectUrl = state.url;
    return this.token.checkToken(this.authApi).pipe(
      tap(
        res => {
          if (!res) { this.router.navigate(['/login']); }
        },
        error => this.router.navigate(['/login'])
      )
    );
  }
}

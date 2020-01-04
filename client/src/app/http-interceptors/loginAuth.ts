import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiConfig } from '../settings/apiConfig';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginAuthInterceptor implements HttpInterceptor {
  constructor(
    private token: TokenService
  ) { }

  private needTokenApi = [apiConfig.authApi];
  private newReq: HttpRequest<any>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.needTokenApi.includes(req.url)) {
      this.newReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.token.get())
      });
      return next.handle(this.newReq);
    }
    return next.handle(req);
  }
}

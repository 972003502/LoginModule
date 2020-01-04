import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let result: any;
    return next.handle(req).pipe(
      tap(
        res => result = res,
        error => console.error(error.message, error),
        () => {
          console.log({
            method: req.method,
            reqUrl: req.urlWithParams,
            reqBody: req.body,
            resBody: result.body
          });
        }
      )
    );
  }
}

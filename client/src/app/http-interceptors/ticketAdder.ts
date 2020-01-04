import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiConfig } from '../settings/apiConfig';
import { TicketService } from '../services/ticket.service';

const needTicket = [
  { url: apiConfig.registerApi, ticket: ['salt', 'emailCaptcha'] },
  { url: apiConfig.loginApi, ticket: ['salt', 'captcha'] },
  { url: apiConfig.resetPasswordApi, ticket: ['salt', 'emailCaptcha'] },
];

@Injectable()
export class TicketAdderInterceptor implements HttpInterceptor {
  constructor(private ticket: TicketService) {
    this.ticket.options = needTicket;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      const ticketCache = this.ticket.getByUrl(req.url);
      if (this.ticket.includes(req.url) && ticketCache) {
        Object.assign(req.body, { ticket: ticketCache });
      }
    }
    return next.handle(req).pipe(
      tap((res: any) => {
        if (res.type === 4) {
          if (res.body.data.ticket) {
            this.ticket.set(res.body.data.ticket);
          }
        }
      })
    );
  }
}

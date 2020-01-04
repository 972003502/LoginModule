import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginAuthInterceptor } from './loginAuth';
import { LoggerInterceptor } from './logger';
import { TicketAdderInterceptor } from './ticketAdder';
// import { CatchErrorInterceptor } from './catchError';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LoginAuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TicketAdderInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: CatchErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true },
];

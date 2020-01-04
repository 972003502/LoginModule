import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterInfo } from '../models/RegisterInfo';
import { ResponseBody } from '../models/ResponseBody';
import { debounceTime, distinctUntilChanged, first, tap, last } from 'rxjs/operators';
import { Observable, concat } from 'rxjs';
import { apiConfig } from '../settings/apiConfig';
import { CryptoService } from './crypto.service';
import { ErrorResponse } from '../models/ErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(
    private http: HttpClient,
    private crypto: CryptoService
  ) { }

  private registerApi = apiConfig.registerApi;
  private saltApi = apiConfig.saltApi;
  private userInfoApi = apiConfig.userInfoApi;
  private registerCaptchaApi = apiConfig.registerCaptchaApi;

  public register(info: RegisterInfo): Observable<ResponseBody> {
    info.email = info.email.toLowerCase();
    info.emailCaptcha = info.emailCaptcha.toLowerCase();
    const getSalt = this.getSalt().pipe(
      tap(res => info.password = this.crypto.encryptWithSalt(info.password, res.data.salt))
    );
    const postInfo = this.postInfo(info);
    return concat<ResponseBody>(getSalt, postInfo).pipe(last());
  }

  public hasUser(email: string): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(
      this.userInfoApi,
      {
        params: { email: email.toLowerCase() },
        responseType: 'json'
      }
    ).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      first()
    );
  }

  public sendMail(email: string): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(
      this.registerCaptchaApi,
      {
        params: { email: email.toLowerCase() },
        responseType: 'json'
      }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.registerCaptchaApi, res);
        }
      })
    );
  }

  private getSalt(): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(
      this.saltApi,
      { responseType: 'json' }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.saltApi, res);
        }
      })
    );
  }

  private postInfo(body: any): Observable<ResponseBody> {
    return this.http.post<ResponseBody>(
      this.registerApi,
      body,
      { responseType: 'json' }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.registerApi, res);
        }
      })
    );
  }
}

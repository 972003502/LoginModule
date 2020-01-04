import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';
import { apiConfig } from '../settings/apiConfig';
import { Observable, concat } from 'rxjs';
import { tap, last } from 'rxjs/operators';
import { LoginInfo } from '../models/LoginInfo';
import { ResponseBody } from '../models/ResponseBody';
import { ErrorResponse } from '../models/ErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private crypto: CryptoService
  ) { }

  private loginApi = apiConfig.loginApi;
  private userInfoApi = apiConfig.userInfoApi;
  private saltApi = apiConfig.saltApi;
  private loginCaptchaApi = apiConfig.loginCaptchaApi;

  public login(info: LoginInfo): Observable<ResponseBody> {
    let passwordSalt: string;
    info.email = info.email.toLowerCase();
    info.captcha = info.captcha.toLowerCase();
    const getUserSalt = this.getUserSalt(info.email).pipe(
      tap(res => passwordSalt = this.crypto.encryptWithSalt(info.password, res.data.salt))
    );
    const getSalt = this.getSalt().pipe(
      tap(res => info.password = this.crypto.encryptWithSalt(passwordSalt, res.data.salt))
    );
    const postInfo = this.postInfo(info);
    return concat<ResponseBody>(getUserSalt, getSalt, postInfo).pipe(last());
  }

  private getUserSalt(email: string): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(
      this.userInfoApi,
      {
        params: { email: email.toLowerCase() },
        responseType: 'json'
      }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.userInfoApi, res);
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

  private postInfo(info: LoginInfo): Observable<ResponseBody> {
    return this.http.post<ResponseBody>(
      this.loginApi,
      info,
      { responseType: 'json' }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.loginApi, res);
        }
      })
    );
  }

  public getCapthcha(picWidth: number, picHeight: number): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(
      this.loginCaptchaApi,
      {
        params: {
          width: picWidth.toString(),
          height: picHeight.toString()
        },
        responseType: 'json'
      }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.loginCaptchaApi, res);
        }
      })
    );
  }
}

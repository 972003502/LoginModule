import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
import { ResponseBody } from '../models/ResponseBody';
import { apiConfig } from '../settings/apiConfig';
import { tap, last } from 'rxjs/operators';
import { ErrorResponse } from '../models/ErrorResponse';
import { ResetPosswordInfo } from '../models/ResetPosswordInfo';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  constructor(
    private http: HttpClient,
    private crypto: CryptoService
  ) { }

  private userInfoApi = apiConfig.userInfoApi;
  private saltApi = apiConfig.saltApi;
  private resetPwdCaptchalApi = apiConfig.resetPwdCaptchalApi;
  private resetPasswordApi = apiConfig.resetPasswordApi;

  public resetPassword(info: ResetPosswordInfo): Observable<ResponseBody> {
    info.email = info.email.toLowerCase();
    info.emailCaptcha = info.emailCaptcha.toLowerCase();
    const getSalt = this.getSalt().pipe(
      tap(res => info.newPassword = this.crypto.encryptWithSalt(info.newPassword, res.data.salt))
    );
    const postInfo = this.updateInfo(info);
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
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.userInfoApi, res);
        }
      })
    );
  }

  public sendMail(email: string): Observable<ResponseBody> {
    return this.http.get<ResponseBody>(
      this.resetPwdCaptchalApi,
      {
        params: { email: email.toLowerCase() },
        responseType: 'json'
      }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.resetPwdCaptchalApi, res);
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

  private updateInfo(info: ResetPosswordInfo): Observable<ResponseBody> {
    return this.http.put<ResponseBody>(
      this.resetPasswordApi,
      info,
      { responseType: 'json' }
    ).pipe(
      tap(res => {
        if (res.status !== 200) {
          throw new ErrorResponse(this.resetPasswordApi, res);
        }
      })
    );
  }
}

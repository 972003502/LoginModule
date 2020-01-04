import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseBody } from '../models/ResponseBody';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { }

  redirectUrl: string;
  tokenKey: 'access_token';

  public set(object: string, token: string): void {
    if (object === 'local') {
      this.clear('session');
      this.storage.set('local', this.tokenKey, token);
    } else if (object === 'session') {
      this.clear('local');
      this.storage.set('session', this.tokenKey, token);
    } else if (object === 'all') {
      this.storage.set('local', this.tokenKey, token);
      this.storage.set('session', this.tokenKey, token);
    } else {
      return;
    }
  }

  public get(object?: string): string | any {
    const localToken = this.storage.get('local', this.tokenKey);
    const sessionToken = this.storage.get('session', this.tokenKey);
    if (object === 'all') {
      return {
        local: localToken,
        session: sessionToken
      };
    } else {
      return localToken || sessionToken;
    }
  }

  public clear(object: string): void {
    if (object === 'local') {
      this.storage.remove('local', this.tokenKey);
    } else if (object === 'session') {
      this.storage.remove('session', this.tokenKey);
    } else if (object === 'all') {
      this.storage.remove('local', this.tokenKey);
      this.storage.remove('session', this.tokenKey);
    } else {
      return;
    }
  }

  public checkToken(api: string): Observable<boolean> {
    return this.http.get<ResponseBody>(api).pipe(
      map(res => res.status !== 200 ? false : true)
    );
  }
}

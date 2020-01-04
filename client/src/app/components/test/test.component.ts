import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../services/register.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, concat, throwError } from 'rxjs';
import { apiConfig } from '../../settings/apiConfig';
import { catchError, map, concatAll, concatMap, mergeMap, tap, skip } from 'rxjs/operators';
import { ResponseBody } from '../../models/ResponseBody';
import { ErrorResponse } from '../../models/ErrorResponse';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  constructor(
    private http: HttpClient
  ) { }

  // saltApi = apiConfig.saltApi;
  saltApi = apiConfig.saltApi;
  userInfoApi = apiConfig.userInfoApi;
  sourceOne = of(1, 2, 3, 4, 5, 6, 7, 8, 9).pipe(
    tap(
      res => {
        if (res === 3) {
          throwError('error123');
        }
      }
    )
  );
  sourceTwo = of(4, 5, 6, 7);
  sourceThree = of(7, 8);

  getSalt(): Observable<any> {
    return this.http.get(
      this.saltApi
    ).pipe(
      tap(
        res => {
          if (res.status === 200) {
            throw new ErrorResponse(this.saltApi, res);
          }
        }
      )
    );
  }

  getUser(): Observable<any> {
    return this.http.get(
      this.userInfoApi,
      {
        params: {
          email: '972003502@qq.com'
        }
      }
    );
  }


  btn1() {
    this.getSalt().subscribe(
      res => console.log(res)
    );
  }

  btn2() {
    this.getUser().subscribe(
      res => console.log(res)
    );
  }

  btn3() {
    this.foo().subscribe(
      res => console.log(res),
      err => {
        console.error(err);
      },
      () => console.log('compelet')
    );
    // this.sourceOne.subscribe(
    //   res => console.log(res)
    // );
  }

  foo(): Observable<any> {
    const getSalt = this.getSalt().pipe(
      tap(
        res => console.log('1', res)
      )
    );
    const getUser = this.getUser();
    return concat(getSalt, getUser).pipe(
      skip(1)
    );
  }

  ngOnInit() { }
}

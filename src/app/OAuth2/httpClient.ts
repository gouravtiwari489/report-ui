import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptionsArgs, URLSearchParams, RequestMethod, RequestOptions  } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { AppConstants } from '../app.constants';
import "rxjs/add/operator/mergeMap";
import 'rxjs/add/observable/fromPromise';

import { Router } from "@angular/router";
import {  BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class HttpClient {

  private appData = AppConstants;
  private oauthRefreshUrl = this.appData.appUrl + 'oauth/token?grant_type=refresh_token&refresh_token=';
  private TOKEN = 'token';
  private token = {accessToken: '', expiresIn: 0};
  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private http: Http,
    private router: Router) {}

  public get(url: string, search?: URLSearchParams): Observable<any> {
    return this.request(url, { method: RequestMethod.Get, search })
      .map((response: any) => response);
  }

  public post(url: string, data?: Object): Observable<Object> {
    return this.request(url, { method: RequestMethod.Post }, data)
      .map((response: any) => response);
  }

  public put(url: string, data?: Object): Observable<Object> {
    return this.request(url, { method: RequestMethod.Put }, data)
      .map((response: any) => response);
  }

  public delete(url: string): Observable<Object> {
    return this.request(url, { method: RequestMethod.Delete });
  }

  private request(url: string, options: RequestOptionsArgs, body?: Object): Observable<Response> {
    this.blockUI.start('Loading..');
    options.headers = new Headers();
    options.headers.append('Authorization', 'Bearer ' + this.getToken());

    if (body) {
        options.body = JSON.stringify(body);
        options.headers.append('Content-type', 'application/json');
    }

    let options2 = options;
    return this.http.request(url, options)
      .map((response: any) => response.json())
      .do( ()=> { this.blockUI.stop(); })
      .catch((error) => {
      this.blockUI.stop();
      if (error.status === 401) {
        this.blockUI.start('Loading..');
        let token = JSON.parse(window.localStorage.getItem('token'));
        if(token === null || token === undefined){
          this.router.navigate(["/login"]);
        }
        window.localStorage.removeItem(this.TOKEN);
        let headers = new Headers();
        headers.append("Authorization","Basic Y2xpZW50OmNsaWVudHBhc3N3b3Jk");
        let options = new RequestOptions({ headers: headers });
        return  this.http.post(this.oauthRefreshUrl + token.refreshToken ,"", options)
          .mergeMap((data: any) => {
              let obj = JSON.parse(data.text());
              let accessToken = obj.access_token;
              let expiresIn = obj.expires_in;
              let currentEpochTime = ((new Date)).getTime();
              let expirationPeriodInMilliseconds = expiresIn * 1000;
              let token = {'value': accessToken, 'expirationTime': currentEpochTime + expirationPeriodInMilliseconds,
                          'refreshToken': obj.refresh_token};
              window.localStorage.setItem(this.TOKEN, JSON.stringify(token));
            return this.request(url, options2, body);
          })
          .catch(() => {
            this.blockUI.stop();
            return Observable.fromPromise(this.router.navigate(["/login"]));
          });
      }

      return Observable.throw(error);
    });
  }

  private getToken() {
    let token = JSON.parse(window.localStorage.getItem('token'));
    if(token!=null || token!=undefined){
        return token.value;
    }
 }

}

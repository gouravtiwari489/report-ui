import { Injectable, ErrorHandler } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import { UserService } from '../user.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw'
import {  BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class OauthService{

  private appData = AppConstants;
  private oauthUrl = this.appData.appUrl + 'oauth/token?grant_type=password&username=';
  private oauthRefreshUrl = this.appData.appUrl + 'oauth/token?grant_type=refresh_token&refresh_token=';
  private getLoggedUserUrl = this.appData.appUrl + 'currentlyLoggedIn' ;
  private logoutUrl = this.appData.appUrl + 'clearUserSession';
  private TOKEN = 'token';
  private token = {accessToken: '', expiresIn: 0};
  @BlockUI() blockUI: NgBlockUI;

  constructor(private router: Router, private http: Http ,private user:UserService) {
  }

  obtainAccessToken(user){
    let headers = new Headers();
    headers.append("Authorization","Basic Y2xpZW50OmNsaWVudHBhc3N3b3Jk");
    let options = new RequestOptions({ headers: headers });
     this.blockUI.start("Loading...");
    return this.http.post(this.oauthUrl + user.username + '&password=' + user.password,"", options)
    .map(res => res.json())
    .do( ()=> { this.blockUI.stop(); })
    .catch(this.handleError);    
  }

  getCurrentlyLoggedInUser(data, cont){
    this.saveToken(data);
    let headers = new Headers();
    headers.append('Authorization','Bearer '+ this.getToken());
    let options = new RequestOptions({ headers: headers });        
    return this.http.get(this.getLoggedUserUrl+'/'+cont,options)
      .map(res=>res.json()) 
      .do( ()=> { this.blockUI.stop(); })     
      .catch(this.handleError);         
  }

  gotoDashBoard(data){
    this.saveLoggedUser(data);
    this.blockUI.stop();
    this.router.navigate(['dashboard']);
    this.user.setUserLoggedIn();
  }

  stopBlockUI(){
    this.blockUI.stop();
  }

  logout(formData){
    let headers = new Headers();
    headers.append('Authorization','Bearer '+ this.getToken());
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.logoutUrl, formData,options)
    .catch((error: Response) => {
      return Observable.throw('Problem while logout');
    });
  }

  private saveToken(data){
    let token = this.getTokenFromParams(data);
    window.localStorage.setItem(this.TOKEN, JSON.stringify(token));
  }

  private getTokenFromParams(params) {
    let token = params.access_token;
    let expiresIn = params.expires_in;
    let currentEpochTime = ((new Date)).getTime();
    let expirationPeriodInMilliseconds = expiresIn * 1000;
    return {'value': token, 'expirationTime': currentEpochTime + expirationPeriodInMilliseconds,
             'refreshToken': params.refresh_token};
  }

  private getToken() {
    let token = JSON.parse(window.localStorage.getItem(this.TOKEN));
    if(token!=null || token!=undefined){
        return token.value;
    }
  }

  private saveLoggedUser(data){
    window.localStorage.setItem('Me', JSON.stringify(data));
  }
    
   getLoggedUser() {
    let user = JSON.parse(window.localStorage.getItem('Me'));
    return user;
  }

  private handleError(error: Response) {
    console.log(error);
    if(error.status === 400 || error.status === 401){
      return Observable.throw('Invalid Credentials');
    }else if(error.status === 0){
      return Observable.throw('Problem while authentication Please contact Administrator');
    }else{
      return Observable.throw(error.json().message || 'throw error');
    }
    
  }
}

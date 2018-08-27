import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/do'
import { User } from './user';

@Injectable()
export class UserService {

  private isUserLoggedIn;
  public username;
 
  constructor(private http: Http, private user:User) {
      this.isUserLoggedIn = false;
      this.user= user;
  }

  setUserLoggedIn() {
  	this.isUserLoggedIn = true;
    this.username = this.user.username;
  }

  getUserLoggedIn() {
  	return this.isUserLoggedIn;
  }
  
/* getUserDetails(user)  {
 	let headers = new Headers();
 	headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic YWRtaW46YWRtaW4=');
    let options = new RequestOptions({ headers: headers });
  
    return this.http.post('http://localhost:9080/login', user, options).subscribe(data =>{
    	return data;
    });
  }

	private handleError(error: Response) {
	    console.error(error);
	    return Observable.throw(error.json().error || 'throw error');
	  } */
	  
  
 /* getUserDetails(user){
	  let headers = new Headers();
	 	headers.append('Content-Type', 'application/json');
	    headers.append('Authorization', 'Basic YWRtaW46YWRtaW4=');
	    let options = new RequestOptions({ headers: headers });
	  return this.http
          .post('http://localhost:9080/login', user, options)
          .map((response: Response) => {
              return response.json();
          })
          .catch(this.handleError);
  }

  private handleError(error: Response) {
      return Observable.throw(error.statusText);
  }*/
	  
}

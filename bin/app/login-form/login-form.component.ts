import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import { User } from '../user';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { OauthService } from '../OAuth2/oauth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
import 'rxjs/add/operator/do'
import { HttpClient } from '../OAuth2/httpClient';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [OauthService,HttpClient, DashboardService]
})
export class LoginFormComponent implements OnInit {

  errorMessage: string;
  cont : boolean;
  warningMessage : string;
  e: any;

  constructor(private router:Router, private userService:UserService, private user:User, 
          private http: Http , private oauthService: OauthService, private dashboardService: DashboardService ) { }

  ngOnInit() {
    this.cont = false;
    this.errorMessage = "";
    this.warningMessage = "";
  }

  closeMessageBox(message){
    if(message=== "error"){
      this.errorMessage = "";
    }else{
      this.warningMessage = "";
    }
  }

  loginUser(e) {
    this.e = e;
  	this.e.preventDefault();
  	this.user.username = this.e.target.elements[0].value;
  	this.user.password = this.e.target.elements[1].value;
    this.oauthService.obtainAccessToken(this.user).subscribe(response =>  {
      return this.oauthService.getCurrentlyLoggedInUser(response,this.cont).subscribe(res => {
          this.dashboardService.getConstraint().subscribe(response =>{
             console.log(response); 
          });
          this.oauthService.gotoDashBoard(res);
      },Error => {
        if(Error.includes("Warning!")){
          this.warningMessage = Error;
          this.errorMessage = "";
        } else{
          this.errorMessage = Error;
          this.warningMessage = "";
        }
        this.oauthService.stopBlockUI();
    });
    },Error => {    
        this.oauthService.stopBlockUI();
        this.warningMessage = "";
        this.errorMessage = Error;
    });
//  	if(this.user.userName == 'admin' && this.user.password == 'admin') {
//      this.userService.setUserLoggedIn();
//      let headers = new Headers();
//   	  headers.append('Content-Type', 'application/json');
//      headers.append('Authorization', 'Basic YWRtaW46YWRtaW4=');
//      let options = new RequestOptions({ headers: headers });
//    
//      return this.http.post('http://localhost:9080/datagenerator/login', this.user, options).subscribe(data =>{
//      	// return data;
//    	 if(data.status == 200){
//    		 this.router.navigate(['dashboard']);
//    	 }
//      });
//  	}else{
//  	    	 alert('Invalid Credentials');
//  	}
      
      
  }

  continueLogin() {
      this.cont = true;
      this.loginUser(this.e);
  };
    
  

}

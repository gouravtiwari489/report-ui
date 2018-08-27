import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Tables } from './Tables';
import { Column } from './Column';
import { Report } from './Report';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HttpClient } from '../OAuth2/httpClient';
import { AppConstants } from '../app.constants';
import { saveAs } from 'file-saver';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class DashboardService {
        
  @BlockUI() blockUI: NgBlockUI;
    
  constructor(private http: HttpClient,private _http: Http) {

  }
    
  private appData = AppConstants;
  private constraintTableName= "osi_timesheet_entry";
  getMappings(formData) {
    let headers = new Headers();
    headers.append('Authorization','Bearer '+ this.getToken());
    let options = new RequestOptions({ headers: headers });
    this.blockUI.start("Loading...");
    return this._http.post(this.appData.appUrl+'upload', formData,options)
    .map((response: Response) =>response.json())
     .do( ()=> { this.blockUI.stop(); })
    .catch(this.handleError); 
  }
    
  dummyRequest(){
       return  this.http.get(this.appData.appUrl+'dummy').catch(this.handleError);
  }
   
  private getToken() {
    let token = JSON.parse(window.localStorage.getItem('token'));
    if(token!=null || token!=undefined){
      return token.value;
    }
  }

  downloadFile(formData, fileType) : Observable<Object[]> {
    return Observable.create(observer => {
         
      let xhr = new XMLHttpRequest();
      xhr.open('POST', this.appData.appUrl+'download',true);
      xhr.responseType='blob';
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var contentType = (fileType =='xlsx') ? 'application/octet-stream' : (fileType=="csv" ? 'application/octet-stream' : (fileType=="pdf" ? 'application/pdf' : 'application/xml'));
            var blob = new Blob([xhr.response], { type: contentType });
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      }
      xhr.send(formData);
      });
  }
  
  getColumns(tableName): Observable<Column[]> {
	    return this.http.get(AppConstants.appUrl+"columns?tableName="+tableName)
	      .map((response: Column[]) => <Column[]>response)
	      .catch(this.handleError);
	  }
  
  getReports(reportArea): Observable<Column[]> {
	    return this.http.get(AppConstants.appUrl+"reportArea?reportArea="+reportArea)
	      .map((response: Report[]) => <Report[]>response)
	      .catch(this.handleError);
    }
    
  deleteReport(reportName, reportArea): Observable<Object[]> {
    return this.http.post(AppConstants.appUrl+"deleteReport?reportName="+reportName+"&reportArea="+reportArea)
      .map((response: Report[]) => <Report[]>response)
      .catch(this.handleError);
  }
  
  getConstraint(){
      return this.http.get(AppConstants.appUrl+"firstTimeSaveTableConstraintData?tableName="+this.constraintTableName)
      .map((response: Report[]) => <Report[]>response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.log(error);
    if(error.status === 0){
      return Observable.throw('Problem with server Please contact Administrator');
    }else{
      return Observable.throw(error.json().message || 'Please contact Administrator');
    }
  }

}

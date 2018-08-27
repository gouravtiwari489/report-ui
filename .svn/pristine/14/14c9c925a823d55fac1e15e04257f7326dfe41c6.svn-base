import {HttpClient} from '../../OAuth2/httpClient';
import {AppConstants} from '../../app.constants';
import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {BlockUI, NgBlockUI} from 'ng-block-ui';


@Injectable()
export class ViewReportService {

  @BlockUI() blockUI: NgBlockUI;
  private appData = AppConstants;

  constructor(private http: HttpClient, private _http: Http) {

  }

  generateReport(reportView, isCreatingReport) {

    if (isCreatingReport) {
      var object = {};
      if (reportView.tableColumnMap !== undefined) {
        (reportView.tableColumnMap).forEach((value, key) => {
          var keys = key.split('.'),
            last = keys.pop();
          keys.reduce((r, a) => r[a] = r[a] || {}, object)[last] = value;
        });
        reportView.tableColumnMap = object;
      }
    }

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.getToken());
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({headers: headers});
    this.blockUI.start('Loading...');
    return this._http.post(this.appData.appUrl + 'generateReport', JSON.stringify(reportView), options)
      .map((response: Response) => response)
      .do(() => {this.blockUI.stop();})
      .catch(this.handleError);
  }
  
  downloadFile(format): Observable<Object[]> {
	  
	     return Observable.create(observer => {
	      const xhr = new XMLHttpRequest();
	      xhr.open('GET', AppConstants.appUrl + AppConstants.downloadUrl + '?fileType='+format, true);
	      xhr.setRequestHeader('Authorization', 'Bearer ' + this.getToken());
	      xhr.responseType = 'blob';
	      xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4) {
	          if (xhr.status === 201) {
	            const contentType = AppConstants.fileDownloadContentType;
	            const blob = new Blob([xhr.response], { type: contentType });
	            observer.next(blob);
	            observer.complete();
	          } else {
	            observer.error(xhr.response);
	          }
	        }
	      };
	      xhr.send();
	      });
	  }
  
  downloadExcelFile(format): Observable<Object[]> {
	  
	     return Observable.create(observer => {
	      const xhr = new XMLHttpRequest();
	      xhr.open('GET', AppConstants.appUrl + AppConstants.downloadExcelUrl + '?fileType='+format, true);
	      xhr.setRequestHeader('Authorization', 'Bearer ' + this.getToken());
	      xhr.responseType = 'arraybuffer';
	      xhr.onreadystatechange = function () {
	        if (xhr.readyState === 4) {
	          if (xhr.status === 201) {
	            const contentType = AppConstants.fileDownloadContentType;
	            const blob = new Blob([xhr.response], { type: contentType });
	            observer.next(blob);
	            observer.complete();
	          } else {
	            observer.error(xhr.response);
	          }
	        }
	      };
	      xhr.send();
	      });
	  }


  private getToken() {
    let token = JSON.parse(window.localStorage.getItem('token'));
    if (token != null || token != undefined) {
      return token.value;
    }
  }
    
  getAllFiltersByReportName(reportName): Observable<any[]> {
    return this.http.get(this.appData.appUrl + 'getFiltersByReportName?reportName='+reportName)
      .map((response: any[]) => <any[]>response)
      .catch(this.handleError);
  }
    
    getOperations(columnName, reportType): Observable<any[]>{
    	return this.http.get(this.appData.appUrl + 'filterCondition?columnDisplayName='+columnName+'&ReportArea='+reportType)
        .map((response: any[]) => <any[]>response)
        .catch(this.handleError);
    }
    
   createNewFilter(report){
       let headers = new Headers();
       headers.append('Authorization', 'Bearer ' + this.getToken());
       headers.append('Content-Type', 'application/json');
       let options = new RequestOptions({headers: headers});
       return this._http.post(this.appData.appUrl + 'createFilter', JSON.stringify(report), options)
      .map((response: Response) => response)
      .do(() => {this.blockUI.stop();})
      .catch(this.handleError);
   }
   
   getFilterNames(reportName): Observable<any[]> {
	    return this.http.get(this.appData.appUrl + 'getFilterNames?reportName='+reportName)
	      .map((response: any[]) => <any[]>response)
	      .catch(this.handleError);
	  }
    
    getCustomReport(reportName) {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.getToken());
    headers.append('Content-Type', 'application/JSON');
    let options = new RequestOptions({headers: headers});
     this.blockUI.start('Loading...');
    	return this._http.post(this.appData.appUrl+ reportName,{}, options)
      .map((response: Response) =>response)
      .do(() => {this.blockUI.stop();})
      .catch(this.handleError);
    }

  private handleError(error: Response) {
    console.log(error);
    if (error.status === 0) {
      return Observable.throw('Problem with server Please contact Administrator');
    } else {
      return Observable.throw(error.json().message || 'Please contact Administrator');
    }
  }

}



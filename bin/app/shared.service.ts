import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Report } from './report/Report';

@Injectable()
export class SharedService {
    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();
    
    userName: string;
    reportViewData: Report;
    
  constructor() { }
    
    changeMessage(message: string) {
    this.messageSource.next(message)
  }
    
  public setUserName(name) {
    this.userName = name;
  }

  public getUSerName() {
    return this.userName;
  }

  public setReportViewData(data) {
    this.reportViewData = data;
  }
  
  public getReportViewData(){
    return this.reportViewData;
  }
}

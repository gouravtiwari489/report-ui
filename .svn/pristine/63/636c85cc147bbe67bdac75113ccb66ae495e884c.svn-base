import {Component, OnInit} from '@angular/core';
import {ReportService} from './report.service';
import {HttpClient} from '../OAuth2/httpClient';
import {Report} from './Report';
import {Column} from './Column';
import {ViewReportService} from './view-report/viewReportService';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import {NumericLiteral} from 'typescript';
import {DashboardService} from '../dashboard/dashboard.service';
import {OauthService} from '../OAuth2/oauth.service';
import * as _ from 'underscore';
import { Project } from './Project';
import { Filter, Field } from './Filter';
import { AppConstants } from '../app.constants';
import { SimpleTimer } from 'ng2-simple-timer';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [ReportService, DashboardService, HttpClient, ViewReportService, OauthService]
})
export class ReportComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  tables = {};
  errorMessage: string = '';
  successMessage: string = '';
  arraysColumns = [];
  listOfColumns: Array<any> = [];
  listOfColumnsCopy: Array<any> = [];
  listOfColumnsCopy2: Array<any> = [];
  newReport = new Report();
  selectedColumns = [];
  allColumns: Array<string> = [];
  selectedColumn: Array<string> = [];
  availableColumns: Array<string> = [];
  columns=[];
  tableColumnMap = {};
  obj: {[k: string]: any} = {};
  view: boolean = true;
  isCreatingReport: boolean;
  filter = new Filter();
  allFilters = [];
  detailReport: boolean= true;
  showGroupBy: boolean= false;
  summaryReport: boolean = false;
  summaryWithGraph: boolean= false;
  crosstabReport: boolean;
  operationList=[[]];
  values=[]
  reportNameList: Array<string>=[];
  valueLists = [this.values];
  messageTimerId: string;
  skipTimerFirstCall: boolean;
  duplicateReportName:boolean= false;
  showDateFields: Array<boolean> =[false];
  showNumberField: Array<boolean> =[false];
  col=  new Column();
  duplicateColumns:boolean= false;
  renamedSelectedColumns = [];
  duplicateColumnDisplayName: boolean= false;
  reportArea: string;
  invalidInputValue: Array<boolean> =[];
  inValidIntValue: boolean = false;
  constructor(private reportService: ReportService, private viewReportService: ViewReportService,
    private router: Router, private dashboardService: DashboardService, private oauth:OauthService, private st: SimpleTimer, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
      var user = this.oauth.getLoggedUser();
      this.newReport.owner= user.username;
      this.newReport.orderByList.push("");
      this.activatedRoute.params.subscribe(params => {
          if (params.name !== undefined) {
              this.reportArea= params.name;
          }
      });
     
      this.reportService.getColumns(this.reportArea).subscribe(response => {
    	  if(response) {
	    	  this.tables = response;
	      }
	      this.arraysColumns = _.union(_.values(this.tables));
	      
	      for (let val of this.arraysColumns) {
	        this.listOfColumns = _.union(this.listOfColumns, val)
	      }
	      
	      this.listOfColumns.sort( function(column1, column2) {
	  	    if ( column1.columnDisplayName < column2.columnDisplayName ){
	  	    	return -1;
	  	    }else if( column1.columnDisplayName > column2.columnDisplayName ){
	  	        return 1;
	  	    }else{
	  	    	return 0;	
	  	    }
	  		});
//	      console.log(JSON.stringify(this.listOfColumns));
	      this.listOfColumnsCopy = JSON.parse(JSON.stringify(this.listOfColumns));
	      this.listOfColumnsCopy2 = JSON.parse(JSON.stringify(this.listOfColumns));
	      this.allColumns = JSON.parse(JSON.stringify(this.listOfColumns));
	      
	      this.listOfColumnsCopy.forEach(column=>{
	    	  column.disabled = false;
	      });
      },
      Error => {
          this.setMessage(Error, AppConstants.errorMessageType);
          this.blockUI.stop();
          window.scrollTo(0, 0);
      });
      
    this.st.newTimer(AppConstants.messageTimerName, AppConstants.messageAutoHideSec );
    this.skipTimerFirstCall = true;
    this.activatedRoute.params.subscribe(params => {
              if (params.name !== undefined) {
                  this.reportArea= params.name;
              }
          });
    this.reportService.getReportNames(this.reportArea).subscribe(response=> {
    	this.reportNameList = response;
    });
  }
  
  validateName(){
	  let index=_.indexOf(this.reportNameList, this.newReport.reportName);
	  if(index != -1){
		  this.duplicateReportName= true;
	  }else{
		  this.duplicateReportName= false;
	  }
  }
  
  getOperations(columnDisplayName, i){
	  this.values = [];
      this.valueLists[i] = [];
      this.obj = this.listOfColumnsCopy2.find( column => column.columnDisplayName === columnDisplayName );
//      console.log(JSON.stringify(this.obj));
      if ( this.obj.typeName == "DATETIME" || this.obj.typeName == "DATE") {
          this.showDateFields[i] = true;
          this.showNumberField[i] = false;
      } else {
          if ( this.obj.typeName == "INT" ) {
              this.showNumberField[i] = true;
          } else {
              this.showNumberField[i] = false;
          }
          this.showDateFields[i] = false;
          this.activatedRoute.params.subscribe(params => {
              if (params.name != undefined) {
                  this.reportArea= params.name;
              }
          });
	      this.viewReportService.getOperations(columnDisplayName, this.reportArea).subscribe(response => {
	    	  if (response) {
	              this.operationList[i] = [];
	              this.operationList[i] = response;
	          }
	      },
	      Error => {
	          this.setMessage(Error, AppConstants.errorMessageType);
	          this.blockUI.stop();
	          window.scrollTo(0, 0);
	      });
	      
	      this.reportService.getValues( this.obj ).subscribe( response => {
	          if ( response.status == 200 ) {
	              //console.log( JSON.stringify( response._body ) );
	              this.values = JSON.parse( response._body );
	              this.valueLists[i] = this.values;
	          }
	      },
		  Error => {
		      this.setMessage(Error, AppConstants.errorMessageType);
		      this.blockUI.stop();
		      window.scrollTo(0, 0);
		  });
  
      }
	  this.listOfColumnsCopy.forEach(column =>{
          if((_.findLastIndex(this.filter.fields, {columnDisplayName:column.columnDisplayName}))>-1)
              column.disabled = true;
          else
              column.disabled = false;
      });
  }

  checkValidInput(columnValue,index){
	  if(columnValue<0){
		  this.invalidInputValue[index] = true;
	  }else{
		  this.invalidInputValue[index] = false;
	  }
	  
	  if(( _.indexOf(this.invalidInputValue, true) != -1)){
		  this.inValidIntValue = true;
	  }else{
		  this.inValidIntValue= false;
	  }
  }
  
  addColumnList(){
      this.filter.fields.push(new Field());
  }
  
  removeColumnList(index){
	  this.listOfColumnsCopy.forEach(column =>{
          if(column.columnDisplayName == this.filter.fields[index].columnDisplayName){
            column.disabled = false;  
          }
      });
      this.filter.fields.splice(index, 1);
      this.invalidInputValue.splice(index, 1);
      
      if(( _.indexOf(this.invalidInputValue, true) != -1)){
		  this.inValidIntValue = true;
	  }else{
		  this.inValidIntValue= false;
	  }
  }
  
  createReport() {
      var date = new Date();
    this.isCreatingReport = true;
    this.newReport.reportArea = this.reportArea;
    this.newReport.sharedTo = ' ';
    this.newReport.actions = '';
    this.newReport.createdDate = date.toDateString();
    this.newReport.lastExcecution = date.toDateString();
    var map = new Map<string, any[]>();
    for (let column of this.selectedColumns) {
      for (let key in this.tables) {
        if (_.findLastIndex(this.tables[key],  {columnName: column.columnName}) != -1) {

          if (!(map.has(key))) {
            var list = [];
            let newColumn = new Column();
            list.push(column);
            map.set(key, list);
          } else {
            if (!_.contains(map.get(key), column)) {
              map.get(key).push(column);
            }
          }
        }
      }
    }
    this.newReport.tableColumnMap = map;
    if(this.newReport.orderByList[0] === ""){
        this.newReport.orderByList = [];
    }
    if(this.newReport.groupByList[0].columnName === ""){
       this.newReport.groupByList = [];
    }
    
    this.newReport.filters = [];
    this.filter.filterName = this.newReport.reportName;
    this.filter.reportName = this.newReport.reportName;
    this.filter.fields.forEach(field =>{
    	field.filterName = this.filter.filterName;
        this.obj = this.listOfColumnsCopy2.find( column => column.columnDisplayName === field.columnDisplayName );
        field.columnName = this.obj.columnName;
        field.columnType= this.obj.typeName;
        if(field.columnType == "DATETIME" || field.columnType == "DATE"){
            field.fromDate= new Date(field.fromDate);
            field.toDate= new Date(field.toDate);
            field.columnValues = [];
        }else{
        	if(field.columnType == "INT"){
        		let intValue = field.columnValues;
        		field.columnValues = [];
        		field.columnValues.push(intValue);
        	}
            field.fromDate= null;
            field.toDate= null;
        }
        
        for (let key in this.tables) {
      		 if((_.findWhere(this.tables[key], {columnName: field.columnName})) != undefined){
      			field.tableName = key;
      		 }
      	  }
    });
    this.newReport.filters.push(this.filter);
    for(let key in this.newReport.groupByList){
        delete this.newReport.groupByList[key].dispAllOpr;
    }
//    console.log("ReportView " + JSON.stringify(this.newReport));
    this.viewReportService.generateReport(this.newReport, this.isCreatingReport).subscribe(response => {
    	console.log(response);
      if (response.status = 200) {
    	  localStorage.setItem("report", JSON.stringify(this.newReport));
          localStorage.setItem("viewResponse", response._body);
          this.router.navigate(['dashboard/'+this.reportArea+'/viewReport']);
      }
      this.setMessage(AppConstants.createFilterSucessMessage, AppConstants.successMessageType);
      this.filter.fields[0].columnValues = [];
    },
    Error => {
        if ( this.newReport.orderByList[0] == undefined ) {
            this.newReport.orderByList = [""];
        }
        if ( this.newReport.groupByList[0] == undefined ) {
            this.newReport.groupByList = [{operation:''  ,columnName: '', dispAllOpr: true}];;
        }
        this.setMessage(Error, AppConstants.errorMessageType);
        this.blockUI.stop();
        window.scrollTo(0, 0);
    });
  }

  addToExcludedALL() {
    this.selectedColumns = JSON.parse(JSON.stringify(this.allColumns));
    for(let i in  this.selectedColumns){
        this.selectedColumns[i].disable=false;
    }
    this.columns= JSON.parse(JSON.stringify(this.selectedColumns));
    this.listOfColumns = [];
  }
  
  addToExcludedRepeat() {
    if (this.availableColumns.length != 0) {
      for (let value of this.availableColumns) {
        if (this.selectedColumns.indexOf(value) == -1) {

          this.selectedColumns.push(value);
          for (let key in this.listOfColumns) {
            if (value == this.listOfColumns[key]) {
              this.listOfColumns.splice(parseInt(key), 1);
            }
          }
        }
      }
      for(let i in  this.selectedColumns){
          
          this.selectedColumns[i].disable=false;
      }
      this.columns= JSON.parse(JSON.stringify(this.selectedColumns));
    }
  }
  
  removeFromExcludedRepeat() {
    if (this.selectedColumn.length != 0) {
      for (let value of this.selectedColumn) {
        if (this.listOfColumns.indexOf(value) == -1 && this.renamedSelectedColumns.indexOf(value) == -1) {
          this.listOfColumns.push(value);
          for (let key in this.selectedColumns) {
            if (value == this.selectedColumns[key]) {
              this.selectedColumns.splice(parseInt(key), 1);
            }
          }
        }
      }
    }
    this.columns= JSON.parse(JSON.stringify(this.selectedColumns));
  }
  
  removeFromExcludedALL() {
    this.listOfColumns = JSON.parse(JSON.stringify(this.allColumns));
    this.selectedColumns = [];
    this.renamedSelectedColumns = [];
    this.selectedColumn = [];
    this.columns= JSON.parse(JSON.stringify(this.selectedColumns));
  }

  addGroupByList( i ) {
      let index = _.findLastIndex( this.columns, {
          columnName: this.newReport.groupByList[i].columnName
      } );
      if ( index != -1 ) {
          this.columns[index].disable = true;
      }
      if ( this.newReport.groupByList[i].columnName != "" ) {
          this.newReport.groupByList.push( {operation:''  ,columnName: '', dispAllOpr: true} );
      }
  }
  
  addOrderByList( i ) {
      let index = _.findLastIndex( this.selectedColumns, {
          columnName: this.newReport.orderByList[i]
      } );
      if ( index != -1 ) {
          this.selectedColumns[index].disable = true;
      }
      if ( this.newReport.orderByList[i] != "" ) {
          this.newReport.orderByList.push( "" );
      }
  }
  
  removeOrderByList( i ) {
      let index = _.findLastIndex( this.selectedColumns, {
          columnName: this.newReport.orderByList[i]
      } );
      if ( index != -1 ) {
          this.selectedColumns[index].disable = false;
      }
      this.newReport.orderByList.splice( i, 1 );
      if ( this.newReport.orderByList.length == 0 ) {
          this.newReport.orderByList.push( "" );
      }
  }
  
  removeGroupByList( i ) {
      let index = _.findLastIndex( this.columns, {
          columnName: this.newReport.groupByList[i].columnName
      } );
      if ( index != -1 ) {
          this.columns[index].disable = false;
      }
      this.newReport.groupByList.splice( i, 1 );
      if ( this.newReport.groupByList.length == 0 ) {
          this.newReport.groupByList.push( {operation:''  ,columnName: '', dispAllOpr: true} );
      }
  }

  viewReportType(name){
      if(name === 'detailReport'){
          this.showGroupBy= false;
          this.summaryReport= false;
          this.summaryWithGraph= false;
          this.crosstabReport= false;
          this.detailReport= true;
      }
      if(name === 'summaryReport'){
          this.showGroupBy= true;
          this.summaryReport = true;
          this.summaryWithGraph= false;
          this.crosstabReport= false;
          this.detailReport= false;
      }
      if(name === 'summaryWithGraph'){
          this.showGroupBy= true;
          this.summaryWithGraph = true;
          this.summaryReport = false;
          this.crosstabReport= false;
          this.detailReport= false;
      }
      if(name === 'crosstabReport'){
          this.showGroupBy= false;
          this.crosstabReport = true;
          this.summaryReport = false;
          this.summaryWithGraph= false;
          this.detailReport= false;
      }
  }
  
  moveUp() {
      let index = _.indexOf( this.selectedColumns, this.selectedColumn[0] );
      if ( index != 0 ) {
          let temp = _.clone( this.selectedColumns[index - 1] );
          this.selectedColumns[index - 1] = _.clone( this.selectedColumn[0] );
          this.selectedColumns[index] = temp;
          this.selectedColumn = [];
      }
  }
  
  moveDown() {
      let index = _.indexOf( this.selectedColumns, this.selectedColumn[0] );
      if ( index != this.selectedColumns.length-1 ) {
          let temp = _.clone( this.selectedColumns[index + 1] );
          this.selectedColumns[index + 1] = _.clone( this.selectedColumn[0] );
          this.selectedColumns[index] = temp;
          this.selectedColumn = [];
      }
  }
  
  addCustomColumn(value){
	  this.col = _.clone(value); 
	  let noOfColumns = [];
	  this.duplicateColumns = false;
	  noOfColumns = _.where(this.selectedColumns, {columnName: this.col.columnName});
	  if(noOfColumns.length>1){
		  this.duplicateColumns = true;
	  }
	  document.getElementById("openColumnModalButton").click();
  }
  
  saveColumn(){
	  let noOfColumns = [];
	  noOfColumns = _.where(this.selectedColumns, {columnDisplayName: this.col.columnDisplayName});
	  if(noOfColumns.length>0){
		  this.setMessage(AppConstants.duplicateColumnDisplayName, AppConstants.errorMessageType);
		  window.scrollTo(0, 0);
	  }else{
		  this.selectedColumns.push(this.col);
		  this.renamedSelectedColumns.push(this.col);
	  }
  }
  
  deleteCustomColumn(){
	  for(let i =0; i<this.selectedColumn.length; i++){
		  let columnIndexRemaned = _.findLastIndex(this.renamedSelectedColumns, this.selectedColumn[i]);
		  if(columnIndexRemaned != -1){
			  this.renamedSelectedColumns.splice(columnIndexRemaned, 1);
			  let selectedColumnIndex = _.findLastIndex(this.selectedColumns, this.selectedColumn[i]);
			  this.selectedColumns.splice(selectedColumnIndex, 1);
		  }
	  }
  }
  
  checkDuplicateColumn(displayName){
	  let index = _.findLastIndex(this.selectedColumns,{columnDisplayName: displayName});
	  if(index != -1){
		  this.duplicateColumnDisplayName = true;
	  }else{
		  this.duplicateColumnDisplayName = false;
	  }
  }
  
  setOpertation(columnName){
      let obj= this.columns.find( column => column.columnName === columnName );
      if(obj.typeName == 'INT' || obj.typeName == 'Double' || obj.typeName == 'decimal'){
          this.newReport.groupByList[this.newReport.groupByList.length-1].dispAllOpr= true;
      }else{
          this.newReport.groupByList[this.newReport.groupByList.length-1].dispAllOpr= false;

      }
  }
  
  setMessage(message, type) {
      this.errorMessage = AppConstants.emptyString;
      this.successMessage = AppConstants.emptyString;
      if (type === AppConstants.errorMessageType) {
          this.errorMessage = message;
      } else if (type === AppConstants.successMessageType ) {
          this.successMessage = message;
      }

      this.st.unsubscribe(this.messageTimerId);
      this.messageTimerId = this.st.subscribe(AppConstants.messageTimerName, () => this.closeMessageBox( type ) );
      this.skipTimerFirstCall = true;
  }
  
  closeMessageBox(message) {
      if (this.skipTimerFirstCall) {
          this.skipTimerFirstCall = false;
      } else {
          if (message === AppConstants.successMessageType) {
              this.successMessage = AppConstants.emptyString;
          } else if (message === AppConstants.errorMessageType) {
              this.errorMessage = AppConstants.emptyString;
          }
          this.st.unsubscribe(this.messageTimerId);
      }
  }
  
}

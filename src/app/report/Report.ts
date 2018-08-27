import { Column } from './Column';
import { Filter } from './Filter';

export class Report { 
  reportName: string;
  reportArea: string;
  owner: string;
  sharedTo: string;
  actions: string;
  createdDate: string;
  lastExcecution: string;
  tableColumnMap : Map<String, Array<Column>>;
  groupByList: Array<{operation: string ,columnName: string, dispAllOpr: boolean}>=[{operation:''  ,columnName: '', dispAllOpr: true}];
  purpose: string;
  orderByList: Array<string>=[];
  filters:Array<Filter>;
}

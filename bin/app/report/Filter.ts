import { Project } from './Project';

export class Filter {
	reportName:string;
    filterName: string;
    fields:Array<Field>=[new Field()]
}

export class Field{
	filterName: string;
	columnName: string;
	columnDisplayName: string;
	operation: string;
	columnValues:Array<any>
	columnValue: string;
	columnType: string;
	fromDate: Date;
	toDate: Date;
  tableName: string;
}
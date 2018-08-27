export class AppConstants {
  public static appUrl = 'http://localhost:9080/report/';
  public static downloadUrl = 'downloadPdf';
  public static downloadExcelUrl = 'downloadExcel';
  public static messageTimerName = 'messageTimerName';
  public static messageAutoHideSec = 5;
  public static successMessageType = 'success';
  public static errorMessageType = 'error';
  public static warningMessageType = 'warning';
  public static errorResponseCheck = 'Error!';
  public static fileTypeDownloadFormField = 'fileType';
  public static fileNameToSave = 'REPORT-';
  public static DefaultFileFormatToSave = '.pdf';
  public static fileDownloadContentType = 'application/octet-stream'; /*'application/pdf';*/
  public static fileDownloadSucessMessage = 'Data download complete.';
  public static fileDownloadErrorMessage = 'Problem while downloading Please contact Administrator';
  public static warningResponseCheck = 'Warning!';
  public static defaultErrorMessage = 'Please contact Administrator';
  public static invalidCredentialsErrorMessage = 'Invalid Credentials';
  public static authenticationProblemErrorMessage = 'Problem while authentication Please contact Administrator';
  public static createFilterSucessMessage = 'Filter created sucessfully.';
  public static applyFilterSucessMessage = 'Filter applied sucessfully.';
  public static logoutErrorMessage = 'Problem while logout';
  public static serverErrorMessage = 'Problem with server Please contact Administrator';
  public static dummyRequestErrorMessage = 'error';
  public static emptyString = '';
  public static duplicateColumnDisplayName = 'This Display Column Name allready exist';
  public static reportDeleteSuccessmsg = 'Report Deleted sucessfully.';
  public static reportDeleteFailuremsg = 'Problem Occured while Deleting';
  
}

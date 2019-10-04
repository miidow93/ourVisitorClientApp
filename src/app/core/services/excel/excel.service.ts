import { Injectable } from '@angular/core';
import { constants } from 'src/app/shared/constants';
import { HttpClient,  } from '@angular/common/http';


const API = constants.api + 'excel/download/';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) { }

  exportToExcel(date) {
    return this.http.get(`${API}${date.startDate}/${date.endDate}`, {responseType: 'blob'});
  }
}

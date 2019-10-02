import { Injectable } from '@angular/core';
import { constants } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';


const API = constants.api + 'excel/';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) { }

  exportToExcel(date) {
    return this.http.post(`${API}`, date);
  }
}

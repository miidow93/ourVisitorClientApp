import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { VisiteurService } from 'src/app/core/services/visiteur/visiteur.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { FormControl } from '@angular/forms';
import { Visiteur } from 'src/app/shared/models/visiteur';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/core/services/excel/excel.service';


const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-visiteur',
  templateUrl: './visiteur.component.html',
  styleUrls: ['./visiteur.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ],
})
export class VisiteurComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['id', 'nomComplet', 'cinCnss', 'personneService', 'societe', 'dateVisite', 'heureEntree', 'heureSortie', 'telephone'];

  dataSource = new MatTableDataSource();
  oldDataSource;
  pageSizeOption = [5, 10, 20];


  data = [];
  dateEntree = new FormControl(moment());
  dateSortie = new FormControl(moment());
  de; ds;
  constructor(private visiteurService: VisiteurService, private excelService: ExcelService) { }

  ngOnInit() {
    // this.adapter.setLocale('fr');
    this.visiteurService.getAllVisitors().subscribe(res => {
      console.log('Visiteurs: ', res);
      if (res.length > 0) {
        this.dataSource.data = res;
        this.oldDataSource = this.dataSource.data;
        this.data = <any[]>this.dataSource.data;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.de = moment(this.dateEntree.value).format('YYYY-MM-DD') + 'T00:00:00';
    this.ds = moment(this.dateSortie.value).format('YYYY-MM-DD') + 'T00:00:00';
    // console.log(`1: Du ${this.de}, Au ${this.ds}`);
  }

  onChange(term, event) {
    // console.log('Date: ', term.value);
    if (event === 'dateEntree') {
      this.de = this.validateDate(term);
      console.log('De: ', new Date(this.de) + ' ' + this.de);
    } else if (event === 'dateSortie') {
      this.ds = this.validateDate(term);
      console.log('Ds: ', new Date(this.ds) + ' ' + this.ds);
    }
  }

  filtrer() {
    // console.log(`De ${this.de}, ds ${this.ds}`);
    console.log('DataSOurce: ', this.dataSource.data);
    if (this.de && this.ds) {
      // console.log('Init');
      if (this.de > this.ds) {
        console.log(this.de);
        alert('La date d\'entree doit être supérieure à la date de sortie');
      } else {
        // console.log(`Du ${this.de}, Au ${this.ds}`);
        const filter = this.data.filter(x => x.dateVisite >= this.de && x.dateVisite <= this.ds);
        // const filter = this.data.filter(x => x.dateVisite === this.de && x.dateVisite === this.ds);
        // console.log('Filter', filter);
        // console.log('DataSOurce: ', this.dataSource.data);
        this.dataSource.data = filter;
        /*if (filter.length > 0) {
          this.dataSource.data = filter;
        } else {
          alert('Aucun visiteur dans cette date. Veuillez choisir une nouvelle date');
        }*/
      }
    }
  }

  exporter() {
    console.log('Date: ', this.de + ' ' + this.ds);
    const date = { dateEntree: this.de, dateSortie: this.ds };
    this.excelService.exportToExcel(date).subscribe(res => console.log('Export: ', res));
  }

  validateDate(date) {
    let result = `${date.value._i.year}`;
    const validateMonth = `${date.value._i.month}`;
    const validateDay = `${date.value._i.date}`;
    console.log('Month: ', validateMonth + ', Day: ' + validateDay);
    const time = 'T00:00:00';
    if (Number(validateMonth) < 9 && Number(validateDay) < 10) {
      result += `-0${Number(validateMonth) + 1}-0${validateDay}${time}`;
      // console.log('Resultat 1: ', result);
    } else {
      if (Number(validateMonth) > 9) {
        result += `-${validateMonth}`;
        // console.log('Resultat 2: ', result);
      } else {
        result += `-0${Number(validateMonth) + 1}`;
        // console.log('Resultat 3: ', result);
      }

      if (Number(validateDay) >= 10) {
        result += `-${validateDay}${time}`;
        // console.log('Resultat 4: ', result);
      } else {
        result += `-0${validateDay}${time}`;
        // console.log('Resultat 5: ', result);
      }
    }
    return result;
  }

  refresh() {
    this.dataSource.data = this.oldDataSource;
  }

}

import { Component, OnInit } from '@angular/core';
import { RegleService } from 'src/app/core/services/regle/regle.service';
import { constants } from 'src/app/shared/constants';
import { Regle } from 'src/app/shared/models/regle';
import { DataService } from 'src/app/shared/services/data.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-regle',
  templateUrl: './list-regle.component.html',
  styleUrls: ['./list-regle.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ListRegleComponent implements OnInit {

  // images = [1, 2, 3].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  imageServer;
  imageToShow = [];
  regles: Regle[];
  constructor(private regleService: RegleService, private ruleDataService: DataService, private config: NgbCarouselConfig) {
    config.interval = null;
   }

  ngOnInit() {
    this.refresh();
  }

  createImagePath(serverPath: string) {
    return `${constants.serverImg}${serverPath}`;
    // return `http://localhost:4772/${serverPath}`;
  }

  refresh() {
    this.regleService.getRulesByOrder().subscribe(res => { this.regles = res; console.log('Regles: ', this.regles)});
    /*this.regleService.getRules().subscribe((res: any[]) => {
      this.imageToShow = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].show) {
          // console.log('Image push', res[i].nom);
          this.imageToShow.push(res[i]);
        }
      }
      console.log('Image To Show 1: ', this.imageToShow);
      this.imageServer = res;
    });*/
    this.ruleDataService.currentRuleDataSource.subscribe(data => {
      this.imageToShow = [];
      data.sort((a, b) => {
        return a.numOrdre - b.numOrdre;
      });
      console.log('Sorted data: ', data);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < data.length; i++) {
        if (data[i].show) {
          // console.log('Image push', res[i].nom);
          this.imageToShow.push(data[i]);
        }
      }
      this.imageServer = data;
      console.log('Rule Data List: ', data);
      console.log('Image To Show 2: ', this.imageToShow);
    });
  }

}

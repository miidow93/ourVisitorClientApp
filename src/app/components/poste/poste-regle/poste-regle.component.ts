import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { RegleService } from 'src/app/core/services/regle/regle.service';
import { constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-poste-regle',
  templateUrl: './poste-regle.component.html',
  styleUrls: ['./poste-regle.component.scss'],
  providers: [NgbCarouselConfig]
})
export class PosteRegleComponent implements OnInit {

  imageServer;
  imageLength = 0;
  imageToShow = [];

  constructor(private regleService: RegleService, config: NgbCarouselConfig) {
    config.interval = null;
  }

  ngOnInit() {
    this.regleService.getRules().subscribe((res: any[]) => {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < res.length; i++) {
        if (res[i].show) {
          this.imageToShow.push(res[i]);
          this.imageLength++;
        }
      }
      this.imageServer = res;
      console.log(this.imageLength);
    });
  }

  createImagePath(serverPath: string) {
    return `${constants.serverImg}${serverPath}`;
    // return `http://localhost:4772/${serverPath}`;
  }
}

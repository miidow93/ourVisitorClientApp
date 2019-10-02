import { Component, OnInit } from '@angular/core';
import { constants } from 'src/app/shared/constants';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  img_Holcim = constants.img_Holcim;
  logoVisiteur = constants.img_OurVisitor;
  img_Cms = constants.img_Cms;
  
  constructor() { }

  ngOnInit() {
  }

}

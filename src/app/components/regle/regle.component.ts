import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormErrorStateMatcher } from 'src/app/core/handlers/form-error-state-matcher';
import { RegleService } from 'src/app/core/services/regle/regle.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-regle',
  templateUrl: './regle.component.html',
  styleUrls: ['./regle.component.scss'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class RegleComponent implements OnInit {

  public progress: number;
  public message: string;
  public response: { 'dbPath': '' };

  regleForm: FormGroup;
  fileToUpload;
  matcher = new FormErrorStateMatcher();
  isLoadingResults = false;
  fileData: File = null;
  previewUrl: any = null;

  constructor(private http: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private regleService: RegleService,
  ) { }



  ngOnInit() {
    this.regleForm = this.formBuilder.group({
      numOrdre: [null, [Validators.required, Validators.min(1)]],
      nom: [null, [Validators.required]],
      description: [null, [Validators.required]],
      // file: [null, Validators.required],
      show: [null, [Validators.required]]
    });


    /*this.regleForm = this.formBuilder.group({
      caption: [null, Validators.required]
    });*/
    // this.regleService.getTest().subscribe(res => console.log('Resultat: ', res));
  }

  onFormSubmit(form: NgForm) {
    console.log(form.value);
    const data = {
      numOrdre: form.value.numOrdre,
      nom: form.value.nom,
      description: form.value.description,
      image: this.previewUrl,
      show: (form.value.show) ? 1 : 0
    };

    this.regleService.addRule(data).subscribe(res => console.log(res));

    console.log('FileToUpload: ', this.previewUrl);
    // this.http.post('http://localhost:4772/api/upload/', formData).subscribe(res => console.log(res));

  }

  public upload(event: any): void {
    this.fileData = event.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      console.log('Result: ', reader.result);
      console.log('Reader: ', this.previewUrl);
    };
  }

  /*public uploadFinished(event) {
    this.response = event;
  }*/

}

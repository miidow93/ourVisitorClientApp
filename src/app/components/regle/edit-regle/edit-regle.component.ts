import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/core/handlers/form-error-state-matcher';
import { RegleService } from 'src/app/core/services/regle/regle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { DataService } from 'src/app/shared/services/data.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-edit-regle',
  templateUrl: './edit-regle.component.html',
  styleUrls: ['./edit-regle.component.scss']
})
export class EditRegleComponent implements OnInit {

  editRegleForm: FormGroup;
  fileToUpload;
  matcher = new FormErrorStateMatcher();
  isLoadingResults = false;
  fileData: File = null;
  previewUrl: any = null;

  constructor(private formBuilder: FormBuilder,
              private regleService: RegleService,
              private dialogRef: MatDialogRef<EditRegleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ruleDataService: DataService) { }

  ngOnInit() {
    this.ruleDataService.currentRuleDataSource.subscribe();
    
    this.editRegleForm = this.formBuilder.group({
      id: [this.data.id, Validators.required],
      numOrdre: [this.data.numOrdre, [Validators.required, Validators.min(1)]],
      nom: [this.data.nom, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      // file: [null, Validators.required],
      show: [this.data.show, [Validators.required]]
    });
  }

  onEditSubmit(form) {
    form.value.image = this.previewUrl;

    if (this.previewUrl) {
      form.value.image = this.previewUrl;
    } else {
      form.value.image = this.data.image;
    }

    this.regleService.updateRule(this.data.id, form.value).subscribe(async res => {
      await this.regleService.getRules().pipe(take(1)).toPromise().then(data => this.ruleDataService.changeRuleDataSource(data));
    });
    this.editRegleForm.reset();
    this.dialogRef.close();
    // this.dialogRef.afterClosed().subscribe(res => this.updateDataSource());
  }

  public upload(event: any): void {
    this.fileData = event.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (event) => {
      this.previewUrl = reader.result;
      console.log('Result: ', reader.result);
      console.log('Reader: ', this.previewUrl);
    };
  }

  close() {
    this.dialogRef.close();
  }

  /*updateDataSource() {
    this.ruleDataService.currentRuleDataSource.subscribe(data => console.log('Edit Rule: ', data));
    this.regleService.getRules().subscribe(res =>  {
      console.log('Edit Rule Change DataSource');
      this.ruleDataService.changeRuleDataSource(res);
    });
  }*/
}

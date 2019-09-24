import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppDataProvider } from './app.dataprovider';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Manage Training Data';

  public $trainingDataList: Observable<any[]>;
  public $apiResult: Observable<any[]>;

  private form: FormGroup;

  constructor(private appDataProvider: AppDataProvider) {

  }

  ngOnInit() {
    const formBuilder = new FormBuilder();
    this.form = formBuilder.group({});
    const trainingFrmCtrl = formBuilder.control({ value: '', disabled: false }, Validators.required);
    this.form.addControl('trainingName', trainingFrmCtrl);
    const startDateFrmCtrl = formBuilder.control({ value: '', disabled: false }, Validators.required);
    this.form.addControl('startDate', startDateFrmCtrl);
    const endDateFrmCtrl = formBuilder.control({ value: '', disabled: false }, Validators.required);
    this.form.addControl('endDate', endDateFrmCtrl);

    this.$trainingDataList = this.appDataProvider.getTrainingData();
    this.$apiResult = this.appDataProvider.getApiResult();
  }

  private resetDefaults() {
    this.form.reset();
  }

  public onSave() {
    const trainingData = {
      trainingName: this.form.controls['trainingName'].value,
      startDate: this.form.controls['startDate'].value,
      endDate: this.form.controls['endDate'].value
    };
    this.appDataProvider.saveTrainingData(trainingData);
    this.resetDefaults();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppDataProvider } from './app.dataprovider';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public $trainingDataList: Observable<any[]>;
  public $apiResult: Observable<any[]>;
  public form: FormGroup;

  private subs: Subscription[];

  constructor(private appDataProvider: AppDataProvider) {
    this.subs = [];
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
    const s = this.$apiResult.subscribe(results => {
      if (results && (results.length > 0)) {
        const lastResult = results[results.length - 1];
        if ((lastResult.action === 'TrainingDataSaved') && lastResult.success) {
          this.form.reset();
        }
      }
    });
    this.subs.push(s);
  }

  public onSave() {
    const trainingData = {
      trainingName: this.form.controls['trainingName'].value,
      startDate: this.form.controls['startDate'].value,
      endDate: this.form.controls['endDate'].value
    };
    this.appDataProvider.saveTrainingData(trainingData);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}

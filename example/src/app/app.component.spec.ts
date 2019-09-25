import { TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { AppDataProvider } from './app.dataprovider';

describe('AppComponent', () => {
  let service: AppDataProvider;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        AppDataProvider
      ]
    }).compileComponents();

    service = TestBed.get(AppDataProvider);
    httpMock = TestBed.get(HttpTestingController);
  }));

  it('Check component creation', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('Check service for all training data', () => {
    const trainingData = [
      { trainingName: 'Training1', startDate: '2019-09-16', endDate: '2019-09-21' },
      { trainingName: 'Training2', startDate: '2019-09-18', endDate: '2019-09-23' }
    ];

    service.getTrainingData().subscribe(td => {
      if (td.length > 0) {
        expect(td.length).toBe(2);
        expect(td).toEqual(trainingData);
      }
    });

    const req = httpMock.expectOne(service.baseServiceUrl + '/trainings');
    expect(req.request.method).toBe('GET');
    req.flush(trainingData);
  });

  it('Check service api for saving training data', async(() => {
    const trainingData = { trainingName: 'Training1', startDate: '2019-09-19', endDate: '2019-09-21' };

    service.saveTrainingData(trainingData);

    service.getApiResult().subscribe(apiResult => {
      if (apiResult.length === 1) {
        expect(apiResult[0].loading).toBe(true);
        expect(apiResult[0].success).toBe(undefined);
        expect(apiResult[0].action).toBe('TrainingDataSaved');
      } else if (apiResult.length === 2) {
        expect(apiResult[1].loading).toBe(false);
        expect(apiResult[1].success).toBe(true);
        expect(apiResult[1].action).toBe('TrainingDataSaved');
      }
    });

    const req = httpMock.expectOne(service.baseServiceUrl + '/trainings');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(trainingData);
    req.flush(trainingData);
  }));

  it('Check empty form data validation', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance as AppComponent;
    const htmlElement = fixture.debugElement.nativeElement as HTMLElement;
    fixture.detectChanges();
    expect(app.form.invalid).toBe(true);
    expect(htmlElement.querySelector('button').disabled).toBeTruthy();
  }));

  it('Initialize valid data and check data validation', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance as AppComponent;
    const htmlElement = fixture.debugElement.nativeElement as HTMLElement;
    fixture.detectChanges();
    app.form.controls['trainingName'].setValue('Training');
    app.form.controls['startDate'].setValue('2019-09-25');
    app.form.controls['endDate'].setValue('2019-09-26');
    fixture.detectChanges();
    expect(app.form.invalid).toBe(false);
    expect(htmlElement.querySelector('button').disabled).toBeFalsy();
  }));

  it('Initialize data but not all mandatory fields and check data validation', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance as AppComponent;
    const htmlElement = fixture.debugElement.nativeElement as HTMLElement;
    fixture.detectChanges();
    app.form.controls['trainingName'].setValue('Training');
    app.form.controls['startDate'].setValue('2019-09-25');
    fixture.detectChanges();
    expect(app.form.invalid).toBe(true);
    expect(htmlElement.querySelector('button').disabled).toBeTruthy();
  }));
});


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
      { trainingName: 'Test1', startDate: '2019-09-16', endDate: '2019-09-21' },
      { trainingName: 'Test2', startDate: '2019-09-18', endDate: '2019-09-23' }
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
    const trainingData = { trainingName: 'TestSaved', startDate: '2019-09-19', endDate: '2019-09-21' };

    service.saveTrainingData(trainingData);

    service.getTrainingData().subscribe(td => {
      if (td.length > 0) {
        expect(td.length).toBe(1);
        expect(td).toEqual([trainingData]);
      }
    });

    const req = httpMock.expectOne(service.baseServiceUrl + '/trainings', );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(trainingData);
    req.flush(trainingData);
  }));

});

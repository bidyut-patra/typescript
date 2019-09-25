import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppDataProvider {
    private $trainingData: BehaviorSubject<any[]>;
    private $apiResult: BehaviorSubject<any[]>;

    public baseServiceUrl = 'http://localhost:64110';

    constructor(private http: HttpClient) {
        this.$trainingData = new BehaviorSubject<any[]>([]);
        this.$apiResult = new BehaviorSubject<any[]>([]);
    }

    public getTrainingData(): Observable<any[]> {
        this.updateProgress('GetTrainingData', true, undefined, this.formatMessage('GET training data', undefined));
        const result = this.http.get<any[]>(this.baseServiceUrl + '/trainings');
        result.subscribe(values => {
            this.updateProgress('GetTrainingData', false, true, this.formatMessage('GET training data', 'success'));
            this.$trainingData.next(values);
        },
        error => {
            this.updateProgress('GetTrainingData', false, false, this.formatMessage('GET training data', this.getHttpError(error)));
        });
        return this.$trainingData;
    }

    public getApiResult(): Observable<any[]> {
        return this.$apiResult;
    }

    public saveTrainingData(trainingData: any) {
        this.updateProgress('TrainingDataSaved', true, undefined, this.formatMessage('POST training data', JSON.stringify(trainingData)));
        const result = this.http.post(this.baseServiceUrl + '/trainings', trainingData);
        result.subscribe(value => {
            this.updateProgress('TrainingDataSaved', false, true, this.formatMessage('POST training data', 'success'));
            this.updateTrainingRecords(value);
        },
        error => {
            this.updateProgress('TrainingDataSaved', false, false, this.formatMessage('POST training data', this.getHttpError(error)));
        });
    }

    private getHttpError(error: any) {
        if (error.status === 0) {
            return error.message;
        } else {
            return error.error;
        }
    }

    private formatMessage(prefixMsg: string, serverMsg: string) {
        const date = new Date();
        let dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        dateStr += ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        let formattedMsg = dateStr + '  ' + prefixMsg;
        if (serverMsg) {
            formattedMsg += ' { ' + serverMsg + ' }';
        }
        return formattedMsg;
    }

    private updateProgress(action: string, loading: boolean, success: boolean, message: string) {
        const notifications = this.$apiResult.getValue();
        notifications.push({
            action: action,
            loading: loading,
            success: success,
            message: message
        });
        this.$apiResult.next(notifications);
    }

    private updateTrainingRecords(value: any) {
        const existingValues = this.$trainingData.getValue();
        existingValues.push(value);
        this.$trainingData.next(existingValues);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppDataProvider {
    private $trainingData: BehaviorSubject<any[]>;
    private $apiResult: BehaviorSubject<any[]>;

    constructor(private http: HttpClient) {
        this.$trainingData = new BehaviorSubject<any[]>([]);
        this.$apiResult = new BehaviorSubject<any[]>([]);
    }

    public getTrainingData(): Observable<any[]> {
        this.updateProgress(true, undefined, this.formatMessage('GET training data', undefined));
        const result = this.http.get<any[]>('');
        result.subscribe(values => {
            this.updateProgress(false, true, this.formatMessage('GET training data', 'success'));
            this.$trainingData.next(values);
        },
        error => {
            this.updateProgress(false, false, this.formatMessage('GET training data', error.message));
        });
        return this.$trainingData;
    }

    private formatMessage(prefixMsg: string, serverMsg: string) {
        let formattedMsg = Date.now() + ' : ' + prefixMsg;
        if (serverMsg) {
            formattedMsg += ' { ' + serverMsg + ' }';
        }
        return formattedMsg;
    }

    private updateProgress(loading: boolean, success: boolean, message: string) {
        const notifications = this.$apiResult.getValue();
        notifications.push({
            loading: loading,
            success: success,
            message: message
        });
        this.$apiResult.next(notifications);
    }

    public getApiResult(): Observable<any[]> {
        return this.$apiResult;
    }

    public saveTrainingData(trainingData: any) {
        this.updateProgress(true, undefined, this.formatMessage('POST training data', JSON.stringify(trainingData)));
        const result = this.http.post('', trainingData);
        result.subscribe(value => {
            this.updateProgress(false, true, this.formatMessage('POST training data', 'success'));
            this.updateTrainingRecords(value);
        },
        error => {
            this.updateProgress(false, false, this.formatMessage('POST training data', error.message));
            this.updateTrainingRecords(trainingData);
        });
    }

    private updateTrainingRecords(value: any) {
        const existingValues = this.$trainingData.getValue();
        existingValues.push(value);
        this.$trainingData.next(existingValues);
    }
}

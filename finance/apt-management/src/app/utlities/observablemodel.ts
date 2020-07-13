import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataState } from './datastate';

export class ObservableModel<T> extends BehaviorSubject<T> {
    private initialValue: T;
    private http: HttpClient;
    public loading: boolean;
    private transform: Function;

    constructor(value: T, http: HttpClient, transform: Function = null) {
        super(value);
        this.initialValue = value;
        this.http = http;
        this.transform = transform;
        this.loading = false;
    }

    private getTransformedData(result: T): T {
        let transformedResult: T = result;
        if (this.transform !== null) {
            transformedResult = this.transform(result);
        }
        return transformedResult;
    }

    public get(url) {
        this.loading = true;
        this.http.get(url)
        .pipe(catchError(error => {
            this.loading = false;
            this.next(this.initialValue);
            return error;
        }))
        .subscribe(result => {
            this.loading = false;
            this.next(this.getTransformedData(<any>result));
        });

        return this;
    }

    public post(url, body) {
        this.loading = true;
        this.http.post(url, body)
        .pipe(catchError(error => {
            this.loading = false;
            this.next(this.initialValue);
            return error;
        }))
        .subscribe(result => {
            this.loading = false;
            this.next(this.getTransformedData(<any>result));
        });

        return this;
    }
}

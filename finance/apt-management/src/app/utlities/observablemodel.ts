import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataState } from './datastate';

export class ObservableModel<T> extends BehaviorSubject<T> {
    private initialValue: T;
    private http: HttpClient;

    constructor(value: T, http: HttpClient) {
        super(value);
        this.initialValue = value;
        this.http = http;
    }

    public get(url) {
        this.http.get(url)
        .pipe(catchError(error => {
            this.next(this.initialValue);
            return error;
        }))
        .subscribe(result => {
            this.next(<any>result);
        });

        return this;
    }

    public post(url, body) {
        this.http.post(url, body)
        .pipe(catchError(error => {
            this.next(this.initialValue);
            return error;
        }))
        .subscribe(result => {
            this.next(<any>result);
        });

        return this;
    }
}

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataState } from './datastate';

export class ObservableModel<T> extends BehaviorSubject<T> {
    private initialValue: T;
    private http: HttpClient;
    public loading: boolean;

    constructor(value: T, http: HttpClient) {
        super(value);
        this.initialValue = value;
        this.http = http;
        this.loading = false;
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
            this.next(<any>result);
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
            this.next(<any>result);
        });

        return this;
    }
}

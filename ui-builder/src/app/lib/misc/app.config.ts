import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApplicationConfiguration {
    public config: any;

    constructor(private http: HttpClient) {

    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('../../app.settings.json')
            .subscribe(response => {
                this.config = response;
                resolve(true);
            });
        });
    }
}

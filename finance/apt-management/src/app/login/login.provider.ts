import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { AppSettings } from 'src/appsettings';
import { Observable } from 'rxjs';
import { ILoginData } from './logindata';

@Injectable()
export class LoginDataProvider {
    constructor(private http: HttpClient, private appSettings: AppSettings) {

    }

    public validateCredential(user: string, password: string): Observable<any> {
        const credentialUrl = this.appSettings.ServerApi + '/login';

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');
        const options = { headers: headers };

        return this.http.post(credentialUrl, {
            user: user,
            password: password
        }, options);
    }
}

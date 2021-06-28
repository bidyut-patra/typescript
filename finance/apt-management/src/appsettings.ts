import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Logger, Level, getDefaultLogger } from 'log4javascript';
import { LogApiAppender } from './LogApiAppender';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ILoginData } from './app/login/logindata';

@Injectable()
export class AppSettings {
    public configuration: any;
    private logger: Logger;
    private loginData: ILoginData;

    constructor(private http: Http) {

    }

    public get ServerApi() {
        return process.env.API_URL;
    }

    public get BaseQueryString() {
        let baseQueryStr = '';
        if (this.UserToken) {
            baseQueryStr += '?user=' + this.UserToken;
        }
        // if (this.SessionId) {
        //     baseQueryStr += '&session=' + this.SessionId;
        // }
        return baseQueryStr;
    }

    public get SessionId() {
        return this.loginData ? this.loginData.sessionId : undefined;
    }

    public get UserToken() {
        return this.loginData ? this.loginData.userToken : undefined;
    }

    public get Role(): any {
        return this.loginData ? this.loginData.role : {};
    }

    public get IsAdmin(): boolean {
        const roleType = this.loginData && this.loginData.role ? this.loginData.role.roleType : undefined;
        return roleType === 'admin';
    }

    public get IsPayment(): boolean {
        const roleType = this.loginData && this.loginData.role ? this.loginData.role.roleType : undefined;
        return roleType === 'payment';
    }

    public set LoginData(loginData: ILoginData) {
        this.loginData = loginData;
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('./assets/appsettings.json')
            .pipe(map(res => res.json()))
            .pipe(catchError((error: any) => {
                console.log('Could not read the configuration file!');
                resolve(true);
                return Observable.throw(error);
            }))
            .subscribe(response => {
                this.initialize(response);
                resolve(true);
            });
        });
    }

    private initialize(config: any) {
        this.configuration = config;
        this.logger = getDefaultLogger();
        const apiAppender = new LogApiAppender(this.configuration.logger);
        this.logger.addAppender(apiAppender);
    }

    public Log(msg: string) {
        this.logger.log(Level.INFO, [msg]);
    }

    public Warn(warning: string) {
        this.logger.log(Level.WARN, [warning]);
    }

    public Error(error: string) {
        this.logger.log(Level.ERROR, [error]);
    }
}

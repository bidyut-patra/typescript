import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataProvider } from './login.provider';
import { AppSettings } from 'src/appsettings';

@Component({
    selector: 'app-login',
    templateUrl: './login.view.html',
    styleUrls: ['./login.style.scss']
})
export class LoginComponent {
    public user: string;
    public password: string;

    constructor(private router: Router,
                private appSettings: AppSettings,
                private loginDataProvider: LoginDataProvider) {
        this.user = '';
        this.password = '';
    }

    public onLogin() {
        console.log('user: ' + this.user);
        console.log('password: ' + this.password);

        this.loginDataProvider.validateCredential(this.user, this.password).subscribe(loginData => {
            if (loginData && loginData.roles && (loginData.roles.length > 0)) {
                this.appSettings.LoginData = loginData;
                if (loginData.roles.length === 1) {
                    this.router.navigate(['/' + loginData.roles[0]]);
                } else {
                    this.router.navigate(['./admin']);
                }
            }
        });
    }

    public onEmailChange(event: any) {
        this.user = event.target.value;
    }

    public onPasswordChange(event: any) {
        this.password = event.target.value;
    }
}

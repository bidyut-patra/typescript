import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataProvider } from './login.provider';
import { AppSettings } from 'src/appsettings';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.view.html',
    styleUrls: ['./login.style.scss']
})
export class LoginComponent implements OnInit {
    public formGroup: FormGroup;
    public submitted: boolean;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private appSettings: AppSettings,
                private loginDataProvider: LoginDataProvider) {
    }

    public get f() {
        return this.formGroup.controls;
    }

    ngOnInit() {
        this.formBuilder = new FormBuilder();
        this.formGroup = this.formBuilder.group({
            'user': new FormControl('', [Validators.email, Validators.required]),
            'password': new FormControl('', Validators.required)
        });
    }

    public onLogin() {
        this.submitted = true;
        if (this.formGroup.valid) {
            const user = this.formGroup.controls['user'].value;
            const password = this.formGroup.controls['password'].value;

            this.loginDataProvider.validateCredential(user, password).subscribe(loginData => {
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
    }
}

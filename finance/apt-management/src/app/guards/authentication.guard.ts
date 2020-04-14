import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AppSettings } from 'src/appsettings';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild {
    constructor(private appSettings: AppSettings,
                private router: Router) {

    }

    canActivate(): boolean {
        if (this.appSettings.UserToken) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

    canActivateChild(): boolean {
        if (this.appSettings.UserToken) {
            return true;
        } else {
            return false;
        }
    }
}

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routes';
import { LoginDataProvider } from './login.provider';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        LoginRoutes,
        FormsModule,
        HttpClientModule
    ],
    exports: [],
    declarations: [
        LoginComponent
    ],
    providers: [
        LoginDataProvider
    ]
})
export class LoginModule {

}

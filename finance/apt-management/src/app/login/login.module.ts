import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutes } from './login.routes';
import { LoginDataProvider } from './login.provider';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        LoginRoutes,
        FormsModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule
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

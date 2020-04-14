import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutes } from './admin.routes';

@NgModule({
    imports: [
        AdminRoutes
    ],
    exports: [],
    declarations: [
        AdminComponent
    ],
    providers: []
})
export class CreditModule {

}

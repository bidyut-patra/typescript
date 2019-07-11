import { NgModule } from '@angular/core';
import { BuildUiRoutes } from './build-ui.routes';
import { BuildUiComponent } from './build-ui.component';
import { PageComponent } from '../controls/page-control/page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ControlDirective } from '../controls/control/control.directive';
import { ControlsModule } from '../controls/controls.module';
import { SharedModule } from '../controls/shared.module';

@NgModule({
    imports: [
        BuildUiRoutes,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        ControlsModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        BuildUiComponent,
        PageComponent
    ],
    providers: []
})
export class BuildUiModule {

}

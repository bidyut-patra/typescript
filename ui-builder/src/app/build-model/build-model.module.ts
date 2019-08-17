import { NgModule } from '@angular/core';
import { BuildModelComponent } from './build-model.component';
import { BuildModelRoutes } from './build-model.routes';
import { DockFrameModule } from '../controls/dock-frame/dock-frame.module';

@NgModule({
    imports: [
        BuildModelRoutes,
        DockFrameModule
    ],
    exports: [],
    declarations: [
        BuildModelComponent
    ],
    providers: []
})
export class BuildModelModule {

}

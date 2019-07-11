import { NgModule } from '@angular/core';
import { BuildModelComponent } from './build-model.component';
import { BuildModelRoutes } from './build-model.routes';

@NgModule({
    imports: [BuildModelRoutes],
    exports: [],
    declarations: [BuildModelComponent],
    providers: []
})
export class BuildModelModule {

}

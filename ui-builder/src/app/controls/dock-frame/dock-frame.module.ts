import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockablePaneComponent } from '../dockable-pane/dockable-pane.component';
import { DockFrameComponent } from './dock-frame.component';

@NgModule({
    imports: [CommonModule],
    exports: [DockFrameComponent],
    declarations: [
        DockFrameComponent,
        DockablePaneComponent
    ]
})
export class DockFrameModule {

}

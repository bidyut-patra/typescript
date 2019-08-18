import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockablePaneComponent } from '../dockable-pane/dockable-pane.component';
import { DockFrameComponent } from './dock-frame.component';
import { HostPaneDirective } from '../dockable-pane/host-pane.directive';
import { ToolPalletComponent } from 'src/app/toolbox-pallet/tool-pallet.component';
import { ToolPropertiesComponent } from 'src/app/tool-properties/tool-properties.component';

@NgModule({
    imports: [CommonModule],
    exports: [DockFrameComponent],
    declarations: [
        DockFrameComponent,
        DockablePaneComponent,
        HostPaneDirective,
        ToolPalletComponent,
        ToolPropertiesComponent
    ],
    entryComponents: [
        ToolPalletComponent,
        ToolPropertiesComponent
    ]
})
export class DockFrameModule {

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DockablePaneComponent } from '../dockable-pane/dockable-pane.component';
import { DockFrameComponent } from './dock-frame.component';
import { HostPaneDirective } from '../dockable-pane/host-pane.directive';
import { ToolPalletComponent } from 'src/app/toolbox-pallet/tool-pallet.component';
import { ToolPropertiesComponent } from 'src/app/tool-properties/tool-properties.component';
import { GraphicsPalletComponent } from 'src/app/graphics-pallet/graphics-pallet.component';
import { GraphicsEditorComponent } from 'src/app/graphics-editor/graphics-editor.component';
import { ControlEditorComponent } from 'src/app/control-editor/control-editor.component';
import { DraggableDirective } from 'src/app/lib/directives/draggable.directive';
import { DroppableDirective } from 'src/app/lib/directives/droppable.directive';

@NgModule({
    imports: [CommonModule],
    exports: [DockFrameComponent],
    declarations: [
        DockFrameComponent,
        DockablePaneComponent,
        HostPaneDirective,
        ToolPalletComponent,
        ToolPropertiesComponent,
        GraphicsPalletComponent,
        GraphicsEditorComponent,
        ControlEditorComponent,
        DraggableDirective,
        DroppableDirective
    ],
    entryComponents: [
        ToolPalletComponent,
        ToolPropertiesComponent,
        GraphicsPalletComponent,
        GraphicsEditorComponent,
        ControlEditorComponent
    ]
})
export class DockFrameModule {

}

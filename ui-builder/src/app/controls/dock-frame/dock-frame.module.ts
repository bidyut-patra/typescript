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
import { ContextMenuDirective } from 'src/app/graphics-editor/context-menu.directive';
import { BlockContextMenuComponent } from 'src/app/graphics-editor/contextmenus/block-context-menu';
import { MemberContextMenuComponent } from 'src/app/graphics-editor/contextmenus/member-context-menu';
import { PortContextMenuComponent } from 'src/app/graphics-editor/contextmenus/port-context-menu';
import { EdgeContextMenuComponent } from 'src/app/graphics-editor/contextmenus/edge-context-menu';
import { GraphContextMenuComponent } from 'src/app/graphics-editor/contextmenus/graph-context-menu';
import { BlockComponent } from 'src/app/graphics-editor/blocks/block.component';
import { GraphNodeDirective } from 'src/app/graphics-editor/graph-node.directive';
import { ProcessComponent } from 'src/app/graphics-editor/blocks/process.component';
import { DecisionComponent } from 'src/app/graphics-editor/blocks/decision.component';
import { DockSplitterComponent } from '../dock-splitter/dock-splitter.component';

@NgModule({
    imports: [CommonModule],
    exports: [DockFrameComponent],
    declarations: [
        DockFrameComponent,
        DockablePaneComponent,
        DockSplitterComponent,
        HostPaneDirective,
        ToolPalletComponent,
        ToolPropertiesComponent,
        GraphicsPalletComponent,
        GraphicsEditorComponent,
        ControlEditorComponent,
        DraggableDirective,
        DroppableDirective,
        ContextMenuDirective,
        GraphNodeDirective,
        GraphContextMenuComponent,
        BlockContextMenuComponent,
        MemberContextMenuComponent,
        PortContextMenuComponent,
        EdgeContextMenuComponent,
        BlockComponent,
        ProcessComponent,
        DecisionComponent
    ],
    entryComponents: [
        ToolPalletComponent,
        ToolPropertiesComponent,
        GraphicsPalletComponent,
        GraphicsEditorComponent,
        ControlEditorComponent,
        GraphContextMenuComponent,
        BlockContextMenuComponent,
        MemberContextMenuComponent,
        PortContextMenuComponent,
        EdgeContextMenuComponent,
        BlockComponent,
        ProcessComponent,
        DecisionComponent
    ]
})
export class DockFrameModule {

}

import { Component } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from '../graphics-pallet/graphics-object';

@Component({
    selector: 'app-graphics-editor',
    templateUrl: './graphics-editor.html',
    styleUrls: ['./graphics-editor.scss']
})
export class GraphicsEditorComponent implements IDockedComponent {
    public title = 'Graphics Editor';
    public footer = 'Draw Graphics';
    public active = true;
    public data = {};
    public allowedTypes = [GraphicsObject];

    constructor() {

    }

    public onDropped(graphObject: GraphicsObject) {
        alert(graphObject.type);
    }
}

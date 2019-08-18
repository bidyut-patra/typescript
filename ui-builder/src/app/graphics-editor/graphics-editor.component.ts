import { Component } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';

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
    public tools: any[];

    constructor() {
        this.tools = [
           { icon: 'fa-calendar', title: 'Calendar' },
           { icon: 'fa-table', title: 'Grid / Table' },
           { icon: 'fa-close', title: 'Close Button' },
           { icon: 'fa-save', title: 'Save Button' }
        ];
    }
}

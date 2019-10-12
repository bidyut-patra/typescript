import { Component, EventEmitter } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';

@Component({
    selector: 'app-control-editor',
    templateUrl: './control-editor.html',
    styleUrls: ['./control-editor.scss']
})
export class ControlEditorComponent implements IDockedComponent {
    public title = 'Control Editor';
    public footer = 'Design UI';
    public active = true;
    public width: number;
    public height: number;
    public data = {};
    public tools: any[];
    public action: EventEmitter<any>;

    constructor() {
        this.tools = [
           { icon: 'fa-calendar', title: 'Calendar' },
           { icon: 'fa-table', title: 'Grid / Table' },
           { icon: 'fa-close', title: 'Close Button' },
           { icon: 'fa-save', title: 'Save Button' }
        ];
    }
}

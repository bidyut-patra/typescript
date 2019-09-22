import { Component } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';

@Component({
    selector: 'app-tool-pallet',
    templateUrl: './tool-pallet.html',
    styleUrls: ['./tool-pallet.scss']
})
export class ToolPalletComponent implements IDockedComponent {
    public title = 'Toolbox Items';
    public footer = 'Toolbox';
    public active = true;
    public width: number;
    public height: number;
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

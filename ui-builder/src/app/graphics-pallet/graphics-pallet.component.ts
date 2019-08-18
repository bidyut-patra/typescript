import { Component } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';

@Component({
    selector: 'app-graphics-pallet',
    templateUrl: './graphics-pallet.html',
    styleUrls: ['./graphics-pallet.scss']
})
export class GraphicsPalletComponent implements IDockedComponent {
    public title = 'Graphics Items';
    public footer = 'Graphics';
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

import { Component } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';
import { GraphicsObject } from './graphics-object';

@Component({
    selector: 'app-graphics-pallet',
    templateUrl: './graphics-pallet.html',
    styleUrls: ['./graphics-pallet.scss']
})
export class GraphicsPalletComponent implements IDockedComponent {
    public title = 'Graphics Items';
    public footer = 'Graphics';
    public active = true;
    public width: number;
    public height: number;
    public data = {};
    public tools: any[];

    constructor() {
        this.tools = [
           { icon: 'fa-bar-chart', title: 'Bar Chart', obj: new GraphicsObject('BAR', 'CHART', 'STATISTICS') },
           { icon: 'fa-pie-chart', title: 'Pie Chart', obj: new GraphicsObject('BAR', 'CHART', 'STATISTICS') },
           { icon: 'fa-area-chart', title: 'Area Chart', obj: new GraphicsObject('BAR', 'CHART', 'STATISTICS') },
           { icon: 'fa-line-chart', title: 'Line Chart', obj: new GraphicsObject('BAR', 'CHART', 'STATISTICS') },
           { icon: 'fa-th', title: 'Blocks', obj: new GraphicsObject('BLOCK', 'CUSTOM', 'CUSTOM') }
        ];
    }
}

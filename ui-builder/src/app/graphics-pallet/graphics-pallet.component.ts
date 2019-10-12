import { Component, EventEmitter } from '@angular/core';
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
    public action: EventEmitter<any>;

    constructor() {
        this.tools = [
           {
               icon: 'fa-bar-chart',
               title: 'Bar Chart',
               obj: new GraphicsObject('bar', 'chart', 'statistics')
           },
           {
               icon: 'fa-pie-chart',
               title: 'Pie Chart',
               obj: new GraphicsObject('pie', 'chart', 'statistics')
           },
           {
               icon: 'fa-area-chart',
               title: 'Area Chart',
               obj: new GraphicsObject('area', 'chart', 'statistics')
           },
           {
               icon: 'fa-line-chart',
               title: 'Line Chart',
               obj: new GraphicsObject('line', 'chart', 'statistics')
           },
           {
               label: 'Decision',
               title: '2 Inputs & 2 Outputs Decision Block',
               obj: new GraphicsObject('decision', 'decision', 'block')
           },
           {
               label: '2 IOs Block',
               title: '2 Inputs & 2 Outputs Block',
               obj: new GraphicsObject('twoIO', '2ioblock', 'block')
           },
           {
               label: '3 IOs Block',
               title: '3 Inputs & 3 Outputs Decision Block',
               obj: new GraphicsObject('threeIO', '3ioblock', 'block')
           },
           {
                label: 'Process Block',
                title: 'Processing Block',
                obj: new GraphicsObject('process', 'process', 'block')
           }
        ];
    }
}

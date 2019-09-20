import { Component, Input, EventEmitter, Output } from '@angular/core';
import { GraphBlock } from '../models/block';
import { IContextMenuComponent } from '../context-menu-component';
import { GraphPoint } from '../models/point';


@Component({
    selector: 'app-block-context-menu',
    template: `<div class="contextMenuOption"><span>Navigate to {{content.Source.DataContext.label}}</span></div>
               <div class="contextMenuOption"><span>Navigate to {{content.Target.DataContext.label}}</span></div>`,
    styleUrls: ['./context-menu.scss']
})
export class EdgeContextMenuComponent implements IContextMenuComponent {
    @Input('content') content: any;
    @Input('location') location: GraphPoint;
    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelect') onSelect = new EventEmitter<any>();

    public text: string;

    constructor() {

    }
}

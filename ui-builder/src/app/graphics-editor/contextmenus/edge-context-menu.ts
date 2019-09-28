import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IContextMenuComponent } from '../context-menu-component';
import { GraphPoint } from '../models/point';
import { EdgeViewModel } from '../viewmodels/edgeviewmodel';


@Component({
    selector: 'app-edge-context-menu',
    template: `<div class="contextMenuOption"><span>Navigate to {{content.source.model.label}}</span></div>
               <div class="contextMenuOption"><span>Navigate to {{content.target.model.label}}</span></div>`,
    styleUrls: ['./context-menu.scss']
})
export class EdgeContextMenuComponent implements IContextMenuComponent {
    @Input('content') content: EdgeViewModel;
    @Input('location') location: GraphPoint;
    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelect') onSelect = new EventEmitter<any>();

    public text: string;

    constructor() {

    }
}

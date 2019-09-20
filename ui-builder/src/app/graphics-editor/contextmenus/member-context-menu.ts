import { Component, Input, EventEmitter, Output } from '@angular/core';
import { GraphBlock, PortSet } from '../models/block';
import { IContextMenuComponent } from '../context-menu-component';
import { GraphPoint } from '../models/point';


@Component({
    selector: 'app-block-context-menu',
    template: `<span>{{content.label}}</span>`,
    styleUrls: ['./context-menu.scss']
})
export class MemberContextMenuComponent implements IContextMenuComponent {
    @Input('content') content: any;
    @Input('location') location: GraphPoint;
    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelect') onSelect = new EventEmitter<any>();

    public text: string;

    constructor() {

    }
}

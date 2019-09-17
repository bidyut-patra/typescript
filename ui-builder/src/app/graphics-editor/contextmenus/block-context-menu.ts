import { Component, Input } from '@angular/core';
import { GraphBlock } from '../models/block';
import { IContextMenuComponent } from '../context-menu-component';


@Component({
    selector: 'app-block-context-menu',
    template: `<span>Block context menu</span>`
})
export class BlockContextMenuComponent implements IContextMenuComponent {
    @Input('content') content: any;

    public text: string;

    constructor() {

    }
}

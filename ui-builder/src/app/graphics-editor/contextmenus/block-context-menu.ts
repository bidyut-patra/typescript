import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IContextMenuComponent } from '../context-menu-component';
import { GraphPoint } from '../models/point';
import { Clipboard } from 'src/app/lib/misc/clipboard';
import { NodeViewModel } from '../viewmodels/nodeviewmodel';


@Component({
    selector: 'app-block-context-menu',
    template: `<div class="contextMenuOption" (click)="onCopy()">
                    <span>Copy</span>
                </div>
                <div class="contextMenuOption" (click)="onDelete()">
                    <span>Delete</span>
                </div>`,
    styleUrls: ['./context-menu.scss']
})
export class BlockContextMenuComponent implements IContextMenuComponent {
    @Input('content') content: NodeViewModel;
    @Input('location') location: GraphPoint;
    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelect') onSelect = new EventEmitter<any>();

    public text: string;

    constructor(private clipboard: Clipboard) {

    }

    public onCopy() {
        this.clipboard.Push({
            sourceDataContext: this.content,
            sourceAction: 'blockCopy'
        });
    }

    public onDelete() {
        this.content.deleteElement();
    }
}

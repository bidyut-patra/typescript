import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IContextMenuComponent } from '../context-menu-component';
import { GraphPoint } from '../models/point';
import { Clipboard } from 'src/app/lib/misc/clipboard';


@Component({
    selector: 'app-graph-context-menu',
    template: `<div class="contextMenuOption" (click)="onPaste()">
                    <span>Paste</span>
                </div>`,
    styleUrls: ['./context-menu.scss']
})
export class GraphContextMenuComponent implements IContextMenuComponent {
    @Input('content') content: any;
    @Input('location') location: GraphPoint;
    // tslint:disable-next-line:no-output-on-prefix
    @Output('onSelect') onSelect = new EventEmitter<any>();

    public text: string;

    constructor(private clipboard: Clipboard) {

    }

    public onPaste() {
        this.onSelect.emit({
            action: 'paste',
            content: this.clipboard.Read(),
            location: this.location
        });
    }
}

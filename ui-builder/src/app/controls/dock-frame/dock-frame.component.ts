import { Component, OnInit, OnChanges, AfterViewChecked, OnDestroy, SimpleChanges } from '@angular/core';
import { DockPosition } from '../dockable-pane/dock-position';
import { Guid } from 'src/app/lib/misc/guid';

@Component({
    selector: 'app-dock-frame',
    templateUrl: './dock-frame.html',
    styleUrls: ['./dock-frame.scss']
})
export class DockFrameComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    private panes: Array<any>;

    constructor() {
        this.panes = [];
    }

    ngOnInit() {
        this.addNewPane(DockPosition.Left, 200, 250);
        //this.addNewPane(DockPosition.Left, 200, 250);
        this.addNewPane(DockPosition.Right, 200, 250);
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngAfterViewChecked() {

    }

    public addNewPane(position: DockPosition, width: number, height: number) {
        if (position) {
            this.panes.push({
                id: Guid.guid(),
                location: position,
                width: width,
                height: height
            });
            this.computeHeight();
        }
    }

    private computeHeight() {
        const height = window.innerHeight - 45;
        this.panes.map(pane => pane.height = height / this.panes.length);
    }

    public removePane(id: string) {
        if (id) {
            const paneIndex = this.panes.indexOf(pane => pane.id === id);
            if (paneIndex >= 0) {
                this.panes.splice(paneIndex, 1);
            }
        }
    }

    ngOnDestroy() {
        this.panes.splice(0, this.panes.length);
    }
}

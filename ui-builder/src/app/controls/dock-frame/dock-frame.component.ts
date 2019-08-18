import { Component, OnInit, OnChanges, AfterViewChecked, OnDestroy, SimpleChanges, ElementRef, Type } from '@angular/core';
import { DockPosition } from '../dockable-pane/dock-position';
import { Guid } from 'src/app/lib/misc/guid';
import { IDockedComponent } from '../dockable-pane/docked-component';
import { ToolPalletComponent } from 'src/app/toolbox-pallet/tool-pallet.component';
import { ToolPropertiesComponent } from 'src/app/tool-properties/tool-properties.component';

@Component({
    selector: 'app-dock-frame',
    templateUrl: './dock-frame.html',
    styleUrls: ['./dock-frame.scss']
})
export class DockFrameComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    private panes: Array<any>;

    constructor(private element: ElementRef<HTMLElement>) {
        this.panes = [];
    }

    ngOnInit() {
        this.addNewPane(DockPosition.Left, 0.15, 0.99999, [
            {
                id: Guid.guid(),
                type: ToolPalletComponent,
                active: true
            },
            {
                id: Guid.guid(),
                type: ToolPropertiesComponent,
                active: false
            }
        ]);
        this.addNewPane(DockPosition.Right, 0.844, 0.99999, []);
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngAfterViewChecked() {

    }

    onResize(event) {
        this.computeHeight();
    }

    public addNewPane(position: DockPosition, width: number, height: number, components: any[]) {
        if (position) {
            this.panes.push({
                id: Guid.guid(),
                location: position,
                width: width,
                height: height,
                components: components
            });
            this.computeHeight();
        }
    }

    private computeHeight() {
        const height = window.innerHeight - 45;
        const width = window.innerWidth;
        this.panes.map(pane => {
            if (pane.height < 1) {
                pane.pxHeight = (height * pane.height);
            } else {
                pane.pxHeight = pane.height;
            }
            if (pane.width < 1) {
                pane.pxWidth = (width * pane.width);
            } else {
                pane.pxWidth = pane.width;
            }
        });
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

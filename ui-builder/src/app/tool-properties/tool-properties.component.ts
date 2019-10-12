import { OnInit, OnChanges, OnDestroy, SimpleChanges, Component, EventEmitter } from '@angular/core';
import { IDockedComponent } from '../controls/dockable-pane/docked-component';

@Component({
    selector: 'app-tool-properties',
    templateUrl: './tool-properties.html',
    styleUrls: ['./tool-properties.scss']
})
export class ToolPropertiesComponent implements IDockedComponent, OnInit, OnChanges, OnDestroy {
    public title = 'Tool Properties';
    public footer = 'Properties';
    public active = true;
    public width: number;
    public height: number;
    public data = {};
    public action: EventEmitter<any>;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngOnDestroy() {

    }
}

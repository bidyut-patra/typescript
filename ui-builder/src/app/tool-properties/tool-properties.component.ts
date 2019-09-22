import { OnInit, OnChanges, OnDestroy, SimpleChanges, Component } from '@angular/core';
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

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngOnDestroy() {

    }
}

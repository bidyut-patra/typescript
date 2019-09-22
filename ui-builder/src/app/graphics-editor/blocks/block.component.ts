import { Component, Input } from '@angular/core';
import { IGraphicsBlockComponent } from '../graphics-block-component';

@Component({
    selector: 'app-block',
    template: `<div class="borderBlock" tabindex="{{i+1}}">
    <div class="block">
        <div class="blockHeader" title="{{data.DataContext.header}}"
            (contextmenu)="onBlockRightClick($event, data)"
            (mouseup)="onBlockMouseUp($event, data)"
            (mousedown)="onHeaderMouseDown($event, data)">
            {{data.DataContext.header}}
        </div>
        <div class="blockContent" (mouseup)="onBlockMouseUp($event, data)"
            *ngFor='let inOutPort of data.InOutPorts'>
            <div class="row" (contextmenu)="onMemberRightClick($event, inOutPort)">
                <div class="col-md-0.5 leftPort" 
                    (contextmenu)="onPortRightClick($event, inOutPort.LeftPort)">
                    <div class="portCandidate" [hidden]="!inOutPort.LeftPort.ShowPortCandidate"></div>
                    <a (mousedown)="onMouseDown($event, inOutPort.LeftPort)">
                        <span class="icon-female-input-left"></span>
                    </a>
                </div>
                <p class="col-md-10" *ngIf="inOutPort.DataContext.label">{{inOutPort.DataContext.label}}</p>
                <div class="col-md-0.5 rightPort"
                    (contextmenu)="onPortRightClick($event, inOutPort.RightPort)">
                    <a (mousedown)="onMouseDown($event, inOutPort.RightPort)">
                        <span class="icon-male-output-right"></span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>`,
    styleUrls: ['./block.scss']
})
export class BlockComponent implements IGraphicsBlockComponent {
    @Input('header') header: string;
    @Input('type') type: string;
    @Input('data') data: any;

    constructor() {

    }
}

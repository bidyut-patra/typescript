import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IGraphicsBlockComponent, IActionPayload, IContextMenuPayload } from '../graphics-block-component';
import { NodeViewModel } from '../viewmodels/nodeviewmodel';
import { PortViewModel } from '../viewmodels/portviewmodel';
import { InOutPortViewModel } from '../viewmodels/inoutportviewmodel';
import { BlockContextMenuComponent } from '../contextmenus/block-context-menu';
import { MemberContextMenuComponent } from '../contextmenus/member-context-menu';
import { PortContextMenuComponent } from '../contextmenus/port-context-menu';

@Component({
    selector: 'app-block',
    template: `<div class="borderBlock" tabindex="{{tabIndex+1}}">
                <div class="block">
                    <div class="blockHeader" title="{{data.DataContext.header}}"
                        (contextmenu)="onBlockRightClick($event, data)"
                        (mousedown)="onHeaderMouseDown($event, data)">
                        {{data.DataContext.header}}
                    </div>
                    <div class="blockContent" *ngFor='let inOutPort of data.InOutPorts'>
                        <div class="row" (contextmenu)="onMemberRightClick($event, inOutPort)">
                            <div class="col-md-0.5 leftPort" (contextmenu)="onPortRightClick($event, inOutPort.LeftPort)">
                                <div class="portCandidate" [hidden]="!inOutPort.LeftPort.ShowPortCandidate"></div>
                                <a (mousedown)="onMouseDown($event, inOutPort.LeftPort)">
                                    <span class="icon-female-input-left"></span>
                                </a>
                            </div>
                            <p class="col-md-10" *ngIf="inOutPort.DataContext.label">{{inOutPort.DataContext.label}}</p>
                            <div class="col-md-0.5 rightPort" (contextmenu)="onPortRightClick($event, inOutPort.RightPort)">
                                <a (mousedown)="onPortMouseDown($event, inOutPort.RightPort)">
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
    @Input('tabIndex') tabIndex: number;

    // tslint:disable-next-line:no-output-on-prefix
    @Output() onAction: EventEmitter<IActionPayload>;

    constructor() {
        this.onAction = new EventEmitter<IActionPayload>();
    }

    public onBlockRightClick(event: MouseEvent, nodeViewModel: NodeViewModel) {
        const payload: IContextMenuPayload = {
            type: 'contextMenu',
            event: event,
            component: BlockContextMenuComponent,
            context: nodeViewModel,
            title: 'Block Context Menu',
            location: {
                x: event.clientX,
                y: event.clientY
            }
        };
        this.onAction.emit(payload);
    }

    public onMemberRightClick(event: MouseEvent, inOutPortViewModel: InOutPortViewModel) {
        const payload: IContextMenuPayload = {
            type: 'contextMenu',
            event: event,
            component: MemberContextMenuComponent,
            context: inOutPortViewModel,
            title: 'Member Context Menu',
            location: {
                x: event.clientX,
                y: event.clientY
            }
        };
        this.onAction.emit(payload);
    }

    public onPortRightClick(event: MouseEvent, portViewModel: PortViewModel) {
        const payload: IContextMenuPayload = {
            type: 'contextMenu',
            event: event,
            component: PortContextMenuComponent,
            context: portViewModel,
            title: 'Port Context Menu',
            location: {
                x: event.clientX,
                y: event.clientY
            }
        };
        this.onAction.emit(payload);
    }

    public onPortMouseDown(event: MouseEvent, portViewModel: PortViewModel) {
        const payload: IActionPayload = {
            type: 'portMouseDown',
            event: event,
            context: portViewModel
        };
        this.onAction.emit(payload);
    }

    public onHeaderMouseDown(event: MouseEvent, nodeViewModel: NodeViewModel) {
        const payload: IActionPayload = {
            type: 'headerMouseDown',
            event: event,
            context: nodeViewModel
        };
        this.onAction.emit(payload);
    }
}

import { Component, OnInit, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IContextMenuPayload } from '../graph-node.component';
import { InOutPortViewModel } from '../viewmodels/inoutportviewmodel';
import { MemberContextMenuComponent } from '../contextmenus/member-context-menu';
import { Clipboard } from 'src/app/lib/misc/clipboard';
import { GraphNodeComponentBase } from './node-component.base';

@Component({
    selector: 'app-block',
    template: `<div class="borderBlock" tabindex="{{tabIndex+1}}"
                    (click)="onFocus($event)"
                    (focusout)="onFocusOut($event)"
                    (keydown)="onKeyDown($event)">
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
export class BlockComponent extends GraphNodeComponentBase implements OnInit, AfterViewInit {

    constructor(element: ElementRef, ref: ChangeDetectorRef, clipboard: Clipboard) {
        super(element, ref, clipboard);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
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
}

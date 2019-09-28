import { Component, Input } from '@angular/core';
import { ProcessBlockViewModel } from '../viewmodels/processblockviewmodel';

@Component({
    selector: 'app-process',
    template: `<div class="borderBlock" tabindex="{{tabIndex+1}}" (keydown)="onKeyDown($event)">
                <div class="block">
                    <div class="blockHeader" title="{{data.DataContext.header}}"
                        (focus)="onFocus($event)"
                        (focusout)="onFocusOut($event)"
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
    styleUrls: ['./process.scss', './block.scss']
})
export class ProcessComponent {
    @Input('header') header: string;
    @Input('type') type: string;
    @Input('data') data: ProcessBlockViewModel;
    @Input('tabIndex') tabIndex: number;
}

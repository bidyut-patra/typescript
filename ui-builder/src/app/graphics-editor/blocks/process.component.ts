import { Component, OnInit, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GraphNodeComponentBase } from './node-component.base';
import { Clipboard } from 'src/app/lib/misc/clipboard';

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
                    <div class="blockContent processContent">
                        <div *ngFor='let port of data.Ports' (mousedown)="onPortMouseDown($event, port)"
                            [ngStyle]="{ 'margin-left': (port?.RelativeX - 33) + 'px', 'margin-top': (port?.RelativeY - 58) + 'px' }"
                            class="processPort" (contextmenu)="onPortRightClick($event, port)">
                            <div class="portCandidate" [hidden]="!port.ShowPortCandidate"></div>
                        </div>
                    </div>
                </div>
            </div>`,
    styleUrls: ['./block.scss', './process.scss']
})
export class ProcessComponent extends GraphNodeComponentBase implements OnInit, AfterViewInit {

    constructor(element: ElementRef, ref: ChangeDetectorRef, clipboard: Clipboard) {
        super(element, ref, clipboard);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
    }
}

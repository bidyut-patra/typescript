import { Component, OnInit, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GraphNodeComponentBase } from './node-component.base';
import { Clipboard } from 'src/app/lib/misc/clipboard';

@Component({
    selector: 'app-decision',
    template: `<div class="borderBlock" tabindex="{{tabIndex+1}}" (keydown)="onKeyDown($event)">
                <div class="decision">
                    <div (focus)="onFocus($event)"
                         (focusout)="onFocusOut($event)"
                         (contextmenu)="onBlockRightClick($event, data)"
                         (mousedown)="onHeaderMouseDown($event, data)"
                         (dblclick)="onDoubleClick($event)"
                         class="blockContent decisionContent">
                        <div *ngFor='let port of data.Ports' (mousedown)="onPortMouseDown($event, port)"
                            [ngStyle]="{ 'margin-left': (port?.RelativeX - 30) + 'px', 'margin-top': (port?.RelativeY - 16) + 'px' }"
                            class="decisionPort" (contextmenu)="onPortRightClick($event, port)">
                            <div class="portCandidate" [hidden]="!port.ShowPortCandidate"></div>
                        </div>
                        <input type="text" class="decisionText"
                               *ngIf="showTextBox" [value]="text"
                               (change)="onEdit($event)"
                               (focusout)="onBlur($event)"/>
                        <div class="decisionLabel" *ngIf="!showTextBox" title="{{text}}">{{text}}</div>
                    </div>
                </div>
            </div>`,
    styleUrls: ['./block.scss', './decision.scss']
})
export class DecisionComponent extends GraphNodeComponentBase implements OnInit, AfterViewInit {

    public showTextBox = false;
    public text = 'Decision ?';

    constructor(element: ElementRef, ref: ChangeDetectorRef, clipboard: Clipboard) {
        super(element, ref, clipboard);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
    }

    public onDoubleClick(event: Event) {
        this.showTextBox = true;
        (event.target as HTMLElement).focus();
    }

    public onEdit(event: Event) {
        this.text = (<any>(event.target)).value;
        this.ref.detectChanges();
    }

    public onBlur(event: Event) {
        this.showTextBox = false;
        this.ref.detectChanges();
    }
}

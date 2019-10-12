import { Component, OnInit, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { GraphNodeComponentBase } from './node-component.base';
import { Clipboard } from 'src/app/lib/misc/clipboard';
import { PortViewModel } from '../viewmodels/portviewmodel';

@Component({
    selector: 'app-decision',
    template: `<div class="borderBlock" tabindex="{{tabIndex+1}}" (keydown)="onKeyDown($event)" (dblclick)="onDoubleClick($event)">
                <div class="decision">
                    <div (focus)="onFocus($event)"
                         (focusout)="onFocusOut($event)"
                         (contextmenu)="onBlockRightClick($event, data)"
                         (mousedown)="onHeaderMouseDown($event, data)"
                         class="blockContent decisionContent">
                        <div *ngFor='let port of data.Ports' (mousedown)="onPortMouseDown($event, port)"
                            [ngStyle]="{ 'margin-left': getPortMarginLeft(port) + 'px', 'margin-top': getPortMarginTop(port) + 'px' }"
                            class="decisionPort" (contextmenu)="onPortRightClick($event, port)">
                            <div class="portCandidate" [hidden]="!port.ShowPortCandidate"></div>
                            <span [ngClass]="getPortIconClass(port)"></span>
                        </div>
                        <input type="text" class="decisionText"
                               *ngIf="showTextBox" [value]="text"
                               (keydown)="onTextKeyDown($event)"
                               (change)="onTextEdit($event)"
                               (blur)="onTextBlur($event)" #inputText/>
                        <div class="decisionLabel noselect" *ngIf="!showTextBox" title="{{text}}"><p>{{text}}</p></div>
                    </div>
                </div>
            </div>`,
    styleUrls: ['./base.scss', './block.scss', './decision.scss']
})
export class DecisionComponent extends GraphNodeComponentBase implements OnInit, AfterViewInit {
    @ViewChild('inputText') inputText;

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
        setTimeout(() => {
            this.inputText.nativeElement.focus();
            this.inputText.nativeElement.select();
        }, 0);
        event.stopPropagation();
    }

    public onTextEdit(event: Event) {
        this.text = (<any>(event.target)).value;
        this.ref.detectChanges();
    }

    public onTextBlur(event: Event) {
        this.showTextBox = false;
        this.ref.detectChanges();
        event.stopPropagation();
    }

    public onTextKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.inputText.nativeElement.blur();
        }
        event.stopPropagation();
    }

    public getPortMarginLeft(port: PortViewModel) {
        let marginLeft;
        switch (port.model.direction) {
            case 'LeftIn':
                marginLeft = -35;
                break;
            case 'TopIn':
                marginLeft = 30;// + (port.Owner.Node.Size.Width / 2);
                break;
            case 'RightOut':
                marginLeft = 95;// + port.Owner.Node.Size.Width;
                break;
            case 'BottomOut':
                marginLeft = 35;// + (port.Owner.Node.Size.Width / 2);
                break;
            default:
                break;
        }
        return marginLeft;
    }

    public getPortMarginTop(port: PortViewModel) {
        let marginTop;
        switch (port.model.direction) {
            case 'LeftIn':
                marginTop = 25;// + (port.Owner.Node.Size.Height / 2);
                break;
            case 'TopIn':
                marginTop = -42;
                break;
            case 'RightOut':
                marginTop = 25;// + (port.Owner.Node.Size.Height / 2);
                break;
            case 'BottomOut':
                marginTop = 90;// + port.Owner.Node.Size.Height;
                break;
            default:
                break;
        }
        return marginTop;
    }

    public getPortIconClass(port: PortViewModel) {
        let iconClass;
        switch (port.model.direction) {
            case 'LeftIn':
                iconClass = 'icon-female-input-left';
                break;
            case 'TopIn':
                iconClass = 'icon-female-input-top';
                break;
            case 'RightOut':
                iconClass = 'icon-male-output-right';
                break;
            case 'BottomOut':
                iconClass = 'icon-male-output-bottom';
                break;
            default:
                break;
        }
        return iconClass;
    }
}

import { Component, OnInit, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { GraphNodeComponentBase } from './node-component.base';
import { Clipboard } from 'src/app/lib/misc/clipboard';
import { PortViewModel } from '../viewmodels/portviewmodel';

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
                            [ngStyle]="{ 'margin-left': getPortMarginLeft(port) + 'px', 'margin-top': getPortMarginTop(port) + 'px' }"
                            class="processPort" (contextmenu)="onPortRightClick($event, port)">
                            <div class="portCandidate" [hidden]="!port.ShowPortCandidate"></div>
                            <span [ngClass]="getPortIconClass(port)"></span>
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

    public getPortMarginLeft(port: PortViewModel) {
        let marginLeft;
        switch (port.model.direction) {
            case 'LeftIn':
                marginLeft = -20;
                break;
            case 'TopIn':
                marginLeft = 77;// + (port.Owner.Node.Size.Width / 2);
                break;
            case 'RightOut':
                marginLeft = 178;// + port.Owner.Node.Size.Width;
                break;
            case 'BottomOut':
                marginLeft = 77;// + (port.Owner.Node.Size.Width / 2);
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
                marginTop = 15;// + (port.Owner.Node.Size.Height / 2);
                break;
            case 'TopIn':
                marginTop = -68;
                break;
            case 'RightOut':
                marginTop = 15;// + (port.Owner.Node.Size.Height / 2);
                break;
            case 'BottomOut':
                marginTop = 50;// + port.Owner.Node.Size.Height;
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

import { Input, EventEmitter, Output, ChangeDetectorRef, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonEventHandler } from '../../lib/misc/commonevent.handler';
import { Clipboard } from 'src/app/lib/misc/clipboard';
import { BlockViewModel } from '../viewmodels/blockviewmodel';
import { IActionPayload, IGraphNodeComponent, IContextMenuPayload } from '../graph-node.component';
import { NodeViewModel } from '../viewmodels/nodeviewmodel';
import { PortViewModel } from '../viewmodels/portviewmodel';

export class GraphNodeComponentBase implements IGraphNodeComponent, OnInit, AfterViewInit {

    @Input('header') header: string;
    @Input('type') type: string;
    @Input('data') data: BlockViewModel;
    @Input('tabIndex') tabIndex: number;

    // tslint:disable-next-line:no-output-on-prefix
    @Output() onAction: EventEmitter<IActionPayload>;

    protected commonEventHandler: CommonEventHandler;
    protected element: ElementRef;
    protected ref: ChangeDetectorRef;
    protected clipboard: Clipboard;

    constructor(element: ElementRef, ref: ChangeDetectorRef, clipboard: Clipboard) {
        this.element = element;
        this.ref = ref;
        this.clipboard = clipboard;
        this.onAction = new EventEmitter<IActionPayload>();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.commonEventHandler = new CommonEventHandler(this.element.nativeElement);
        this.commonEventHandler.initialize();
    }

    public onKeyDown(event: KeyboardEvent) {
        const ctrlKeyPressed = this.commonEventHandler.CtrlKeyPressed;
        if (ctrlKeyPressed && (event.keyCode === 67)) {
            this.clipboard.Push({
                sourceDataContext: this.data,
                sourceAction: 'blockCopy'
            });
        } else if (event.keyCode === 46) {
            this.data.deleteElement();
        } else {}
    }

    public onFocus(event: MouseEvent) {
        this.data.selected = true;
        this.data.onSelect.emit();
        this.ref.detectChanges();
    }

    public onFocusOut(event: MouseEvent) {
        this.data.selected = false;
        this.data.onSelect.emit();
        this.ref.detectChanges();
    }

    public onBlockRightClick(event: MouseEvent, nodeViewModel: NodeViewModel) {
        const payload: IContextMenuPayload = {
            type: 'contextMenu',
            event: event,
            component: nodeViewModel.contextMenuComponent,
            context: nodeViewModel,
            title: 'Block Context Menu',
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
            component: portViewModel.contextMenuComponent,
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
        event.stopPropagation();
    }

    public onHeaderMouseDown(event: MouseEvent, nodeViewModel: NodeViewModel) {
        this.onFocus(event);
        const payload: IActionPayload = {
            type: 'headerMouseDown',
            event: event,
            context: nodeViewModel
        };
        this.onAction.emit(payload);
    }
}

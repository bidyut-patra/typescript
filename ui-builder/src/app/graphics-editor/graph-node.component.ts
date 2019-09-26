import { EventEmitter, Type } from '@angular/core';
import { IContextMenuComponent } from './context-menu-component';

export interface IGraphNodeComponent {
    header: string;
    type: string;
    data: any;
    tabIndex: number;
    onAction: EventEmitter<IActionPayload>;
}

export interface IActionPayload {
    type: string;
    event: Event;
    context: any;
}

export interface IContextMenuPayload extends IActionPayload {
    component: Type<IContextMenuComponent>;
    title: string;
    location: { x: number, y: number };
}



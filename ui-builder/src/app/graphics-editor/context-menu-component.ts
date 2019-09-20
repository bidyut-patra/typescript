import { GraphPoint } from './models/point';
import { EventEmitter } from '@angular/core';

export interface IContextMenuComponent {
    location: GraphPoint;
    content: any;
    onSelect: EventEmitter<any>;
}

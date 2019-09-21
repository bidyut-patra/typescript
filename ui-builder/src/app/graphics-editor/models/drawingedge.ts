import { EventEmitter } from '@angular/core';
import { GraphEdge } from './edge';
import { Graph } from './graph';

export class DrawingEdge extends GraphEdge {
    public onMove: EventEmitter<any>;
    public onDisposed: EventEmitter<any>;

    constructor(graph: Graph) {
        super(graph);
        this.onMove = new EventEmitter<any>();
        this.onDisposed = new EventEmitter<any>();
    }
}

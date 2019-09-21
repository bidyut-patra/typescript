import { EventEmitter } from '@angular/core';
import { EdgeLayout } from './edgelayout';
import { IDataContext } from './datacontext';
import { GraphNode } from './node';
import { GraphEdge } from './edge';
import { DrawingEdge } from './drawingedge';

export class Graph implements IDataContext {
    public DataContext: any;
    public onDrawingEdgeCreated: EventEmitter<DrawingEdge>;

    private _edgeLayout: EdgeLayout;
    private _nodes: GraphNode[];
    private _edges: GraphEdge[];
    private _drawingEdge: DrawingEdge;

    constructor() {
        this._edgeLayout = new EdgeLayout();
        this._nodes = [];
        this._edges = [];
        this.onDrawingEdgeCreated = new EventEmitter<DrawingEdge>();
    }

    public get layout(): EdgeLayout {
        return this._edgeLayout;
    }

    public get nodes(): GraphNode[] {
        return this._nodes;
    }

    public addNode(node: GraphNode) {
        if (node) {
            this._nodes.push(node);
        }
    }

    public removeNode(node: GraphNode) {
        if (node) {

        }
    }

    public get edges(): GraphEdge[] {
        return this._edges;
    }

    public setDrawingEdge(edge: DrawingEdge) {
        if (edge) {
            this._drawingEdge = edge;
            this.onDrawingEdgeCreated.emit(edge);
        }
    }
}

import { Graph } from './graph';
import { GraphPoint } from './point';
import { GraphEdge } from './edge';
import { GraphElement } from './element';
import { GraphNode } from './node';

export class GraphPort extends GraphElement {
    private _location: GraphPoint;
    private _connectedEdges: GraphEdge[];

    public Owner: GraphNode;
    public OnOwnerLocationChanged: Function;

    constructor(graph: Graph) {
        super(graph);
        this._location = new GraphPoint(0, 0);
        this._connectedEdges = [];
    }

    public addEdge(edge: GraphEdge) {
        if (edge && !this._connectedEdges.find(e => e === edge)) {
            this._connectedEdges.push(edge);
        }
    }

    public removeEdge(edge: GraphEdge) {
        if (edge) {
            const edgeIndex = this._connectedEdges.findIndex(e => e === edge);
            if (edgeIndex >= 0) {
                this._connectedEdges.splice(edgeIndex, 1);
            }
        }
    }

    public set Location(value: GraphPoint) {
        if (value) {
            this._location = value;
            this.HandlePortLocationChange();
        }
    }

    public get Location(): GraphPoint {
        const x = this.Owner ? this.Owner.Location.X + this._location.X : this._location.X;
        const y = this.Owner ? this.Owner.Location.Y + this._location.Y : this._location.Y;
        const absLocation = new GraphPoint(x, y);
        return absLocation;
    }

    public CanConnect(port: GraphPort): boolean {
        let canConnect = false;
        canConnect = (port !== this) && (port.Owner !== this.Owner);
        return canConnect && !this.IsConnectedTo(port);
    }

    private IsConnectedTo(port: GraphPort): boolean {
        let isConnectedTo = false;
        for (let i = 0; !isConnectedTo && (i < this._connectedEdges.length); i++) {
            const edge = this._connectedEdges[i];
            isConnectedTo = (edge.Source === this) && (edge.Target === port) || (edge.Target === this) && (edge.Source === port);
        }
        return isConnectedTo;
    }

    private HandlePortLocationChange() {
        this._connectedEdges.forEach(e => {
            if (e.Source === this) {
                if (e.OnSourcePortChanged) {
                    e.OnSourcePortChanged(e.Source);
                }
            } else {
                if (e.OnTargetPortChanged) {
                    e.OnTargetPortChanged(e.Target);
                }
            }
        });
    }

    private HandlePortRemove() {
        this._connectedEdges.forEach(e => {
            if (e.Source === this) {
                e.OnSourcePortRemoved(e.Source);
            } else {
                e.OnTargetPortRemoved(e.Target);
            }
        });
    }

    public Dispose() {
        this.HandlePortRemove();
        this._connectedEdges.forEach(e => {
            e.Dispose();
        });
    }
}

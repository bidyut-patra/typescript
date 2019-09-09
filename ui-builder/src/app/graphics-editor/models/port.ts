import { GraphPoint } from './point';
import { GraphEdge } from './edge';
import { GraphElement } from './element';
import { GraphNode } from './node';

export class GraphPort extends GraphElement {
    private _location: GraphPoint;
    private _connectedEdges: GraphEdge[];

    public Owner: GraphNode;
    public OnOwnerLocationChanged: Function;

    constructor() {
        super();
        this._location = new GraphPoint(0, 0);
        this._connectedEdges = [];
    }

    public addEdge(edge: GraphEdge) {
        if (edge && !this._connectedEdges.find(e => e === edge)) {
            this._connectedEdges.push(edge);
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
    }
}

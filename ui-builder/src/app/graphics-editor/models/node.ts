import { GraphPort } from './port';
import { GraphPoint } from './point';
import { GraphElement } from './element';
import { Graph } from './graph';
import { GraphSize } from './size';
import { DrawingEdge } from './drawingedge';

export class GraphNode extends GraphElement {
    private _location: GraphPoint;
    private _drawingEdgeNearThisNode: boolean;

    public Ports: GraphPort[];
    public Size: GraphSize;
    public xHalo: number;

    constructor(graph: Graph) {
        super(graph);

        this._location = new GraphPoint(0, 0);
        this._drawingEdgeNearThisNode = false;

        this.Ports = [];
        this.Graph.layout.registerNode(this);

        this.xHalo = 20.0;

        this.initialize();
    }

    private initialize() {
        const s1 = this.Graph.onDrawingEdgeCreated.subscribe((drawingEdge: DrawingEdge) => {
            const s2 = drawingEdge.onMove.subscribe(() => {
                this.setPortCandidates(drawingEdge.Target.Location);
            });
            this._subscriptions.push(s2);
            const s3 = drawingEdge.onDisposed.subscribe(() => {
                this.resetPortCandidates();
            });
            this._subscriptions.push(s3);
        });
        this._subscriptions.push(s1);
    }

    private resetPortCandidates() {
        if (this._drawingEdgeNearThisNode) {
            this._drawingEdgeNearThisNode = false;
            this.showPortCandidates(this._drawingEdgeNearThisNode);
        }
    }

    private setPortCandidates(drawingEdgeLocation: GraphPoint) {
        this._drawingEdgeNearThisNode = this.isDrawingEdgeNearThisNode(drawingEdgeLocation);
        this.showPortCandidates(this._drawingEdgeNearThisNode);
    }

    private showPortCandidates(showPortCandidate: boolean) {
        for (let j = 0; (j < this.Ports.length); j++) {
            const port = this.Ports[j];
            port.ShowPortCandidate = showPortCandidate;
        }
    }

    private isDrawingEdgeNearThisNode(drawingEdgeLocation: GraphPoint) {
        const region = 80;
        const distanceFromTopLeft = this.getDistanceFromPoint(drawingEdgeLocation, this.Location);
        const bottomLeftLocation = new GraphPoint(this.Location.X, this.Location.Y + this.Size.Height);
        const distanceFromBottomLeft = this.getDistanceFromPoint(drawingEdgeLocation, bottomLeftLocation);
        const topRightLocation = new GraphPoint(this.Location.X + this.Size.Width, this.Location.Y);
        const distanceFromTopRight = this.getDistanceFromPoint(drawingEdgeLocation, topRightLocation);
        const topBottomLocation = new GraphPoint(this.Location.X + this.Size.Width, this.Location.Y + this.Size.Height);
        const distanceFromTopBottom = this.getDistanceFromPoint(drawingEdgeLocation, topBottomLocation);
        const drawingEdgeNearThisNode = (distanceFromTopLeft < region) || (distanceFromBottomLeft < region) ||
                                        (distanceFromTopRight < region) || (distanceFromTopBottom < region);
        return drawingEdgeNearThisNode;
    }

    private getDistanceFromPoint(point1: GraphPoint, point2: GraphPoint): number {
        const xPosDiff = Math.abs(point1.X - point2.X);
        const yPosDiff = Math.abs(point1.Y - point2.Y);
        return xPosDiff + yPosDiff;
    }

    public addPort(port: GraphPort) {
        if (port && !this.Ports.find(p => p === port)) {
            port.Owner = this;
            this.Ports.push(port);
        }
    }

    public removePort(port: GraphPort) {
        if (port) {
            const portIndex = this.Ports.findIndex(p => p === port);
            if (portIndex >= 0) {
                this.Ports.splice(portIndex, 1);
            }
        }
    }

    public set Location(value: GraphPoint) {
        this._location = value;
        this.HandlePortsChange();
    }

    public get Location(): GraphPoint {
        return this._location;
    }

    public get TopLeft(): GraphPoint {
        return new GraphPoint(this._location.X + this.xHalo, this._location.Y);
    }

    public get BottomLeft(): GraphPoint {
        return new GraphPoint(this._location.X + this.xHalo, this._location.Y + this.Size.Height);
    }

    public get TopRight(): GraphPoint {
        return new GraphPoint(this._location.X + this.Size.Width, this._location.Y);
    }

    public get BottomRight(): GraphPoint {
        return new GraphPoint(this._location.X + this.Size.Width, this._location.Y + this.Size.Height);
    }

    private HandlePortsChange() {
        this.Ports.forEach(port => {
            if (port.OnOwnerLocationChanged) {
                port.OnOwnerLocationChanged();
            }
        });
    }

    public Dispose() {
        this.Ports.forEach(p => {
            p.Dispose();
        });
        this.Ports = [];
        this.Graph.layout.unregisterNode(this);
        super.Dispose();
    }
}

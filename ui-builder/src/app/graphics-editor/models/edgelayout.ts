import { GraphEdge } from './edge';
import { GraphPoint } from './point';
import { GraphPort } from './port';

export class EdgeLayout {
    private _edges: GraphEdge[];

    constructor() {
        this._edges = [];
    }

    public registerEdge(edge: GraphEdge) {
        if (edge && !this._edges.find(e => e === edge)) {
            this._edges.push(edge);
        }
    }

    public unregisterEdge(edge: GraphEdge) {
        if (edge) {
            const edgeIndex = this._edges.findIndex(e => e === edge);
            if (edgeIndex >= 0) {
                this._edges.splice(edgeIndex, 1);
            }
        }
    }

    public getEdgePoints(edge: GraphEdge): GraphPoint[] {
        // const edgePoints = [];
        // return edgePoints;
        return this.calcEdgePoints(edge.Source, edge.Target);
    }

    private calcEdgePoints(sourcePort: GraphPort, targetPort: GraphPort): GraphPoint[] {
        const x1 = sourcePort.Location.X;
        const y1 = sourcePort.Location.Y;
        const x2 = targetPort.Location.X;
        const y2 = targetPort.Location.Y;
        const edgePoints: GraphPoint[] = [];
        edgePoints.push(new GraphPoint(x1, y1));
        edgePoints.push(new GraphPoint(x2 / 2, y1));
        edgePoints.push(new GraphPoint(x2 / 2, y2));
        edgePoints.push(new GraphPoint(x2, y2));
        return edgePoints;
    }
}

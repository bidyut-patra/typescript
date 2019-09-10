import { GraphEdge } from './edge';
import { GraphPoint } from './point';
import { GraphPort } from './port';
import { GraphNode } from './node';

export class EdgeLayout {
    private _edges: GraphEdge[];
    private _nodes: GraphNode[];

    constructor() {
        this._edges = [];
        this._nodes = [];
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

    public registerNode(node: GraphNode) {
        if (node && !this._nodes.find(n => n === node)) {
            this._nodes.push(node);
        }
    }

    public unregisterNode(node: GraphNode) {
        if (node) {
            const nodeIndex = this._nodes.findIndex(n => n === node);
            if (nodeIndex >= 0) {
                this._nodes.splice(nodeIndex, 1);
            }
        }
    }

    public getEdgePoints(edge: GraphEdge): GraphPoint[] {
        const edgePoints = this.calcEdgePoints(edge);
        edge.Bends = edgePoints.slice(1, edgePoints.length - 1);
        return edgePoints;
    }

    private calcEdgePoints(edge: GraphEdge): GraphPoint[] {
        const x1 = edge.Source.Location.X;
        const y1 = edge.Source.Location.Y;
        const x2 = edge.Target.Location.X;
        const y2 = edge.Target.Location.Y;
        const edgePoints: GraphPoint[] = [];
        edgePoints.push(new GraphPoint(x1, y1));
        const bendPointX = this.getBendPointX(x1, x2, edge);
        edgePoints.push(new GraphPoint(bendPointX, y1));
        edgePoints.push(new GraphPoint(bendPointX, y2));
        edgePoints.push(new GraphPoint(x2, y2));
        return edgePoints;
    }

    private getBendPointX(x1: number, x2: number, edge: GraphEdge) {
        let bendPointX = x1 + (x2 - x1) / 2;
        const shiftFactor = 10;
        for (let i = 0; i < this._edges.length; i++) {
            const e = this._edges[i];
            if ((e !== edge) && e.Bends && e.Bends.find(b => b.X === bendPointX)) {
                bendPointX -= shiftFactor;
            }
        }
        return bendPointX;
    }

    private getNodesCrossingSegment(segmentStart: GraphPoint, segmentEnd: GraphPoint): GraphNode[] {
        const crossingNodes = [];
        for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];
            const nodeTopLeft = node.Location;
            const nodeBottomRight = new GraphPoint(nodeTopLeft.X + node.Size.Width, nodeTopLeft.Y + node.Size.Height);
            const x1 = this.isXInsideNodeXBoundary(segmentStart, nodeTopLeft, nodeBottomRight);
            const x2 = this.isXInsideNodeXBoundary(segmentEnd, nodeTopLeft, nodeBottomRight);
            const y1 = this.isYInsideNodeYBoundary(segmentStart, nodeTopLeft, nodeBottomRight);
            const y2 = this.isYInsideNodeYBoundary(segmentEnd, nodeTopLeft, nodeBottomRight);
        }
        return crossingNodes;
    }

    private isXInsideNodeXBoundary(point: GraphPoint, nodeTopLeft: GraphPoint, nodeBottomRight: GraphPoint) {
        return (point.X >= nodeTopLeft.X) && (point.X <= nodeBottomRight.X);
    }

    private isYInsideNodeYBoundary(point: GraphPoint, nodeTopLeft: GraphPoint, nodeBottomRight: GraphPoint) {
        return (point.Y >= nodeTopLeft.Y) && (point.Y <= nodeBottomRight.Y);
    }
}

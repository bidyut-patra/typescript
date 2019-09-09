import { GraphEdge } from '../models/edge';
import { GraphPoint } from '../models/point';
import { GraphPort } from '../models/port';
import { Graph } from '../models/graph';

export class EdgeViewModel {
    public edge: GraphEdge;
    public graph: Graph;

    public arrowPoints: string;
    public points: string;
    public stroke: string;
    public strokeWidth: number;

    constructor(graph: Graph) {
        this.graph = graph;
        this.stroke = 'gray';
        this.strokeWidth = 1;
    }

    private createEdge(sourcePort: GraphPort, targetPort: GraphPort): GraphEdge {
        const edge = new GraphEdge(this.graph);
        edge.Source = sourcePort;
        sourcePort.addEdge(edge);
        edge.Target = targetPort;
        targetPort.addEdge(edge);
        return edge;
    }

    public drawEdge(sourcePort: GraphPort, targetPort: GraphPort) {
        this.edge = this.createEdge(sourcePort, targetPort);
        const edgePoints = this.graph.layout.getEdgePoints(this.edge);
        this.points = this.getGraphicalPoints(edgePoints);
        this.arrowPoints = this.getArrowPoints(targetPort);
        this.stroke = 'green';
        this.strokeWidth = 2;
    }

    private getGraphicalPoints(points: GraphPoint[]): string {
        let pointsStr = '';
        points.forEach(p => {
            pointsStr += p.X + ',' + p.Y + ' ';
        });
        pointsStr = pointsStr.substr(0, pointsStr.length - 1);
        return pointsStr;
    }

    private getArrowPoints(targetPort: GraphPort) {
        const factor = 5;
        const x = targetPort.Location.X - factor;
        const y = targetPort.Location.Y;
        let arrowPointsStr = x + ',' + y + ' ' + x + ',' + (y - factor) + ' ' + (x + factor * 2);
        arrowPointsStr += ',' + y + ' ' + x + ',' + (y + factor) + ' ' + x + ',' + y;
        return arrowPointsStr;
    }

    public removeEdge() {
        this.edge.Dispose();
    }

    public updateEdge() {
        const edgePoints = this.graph.layout.getEdgePoints(this.edge);
        this.points = this.getGraphicalPoints(edgePoints);
        this.arrowPoints = this.getArrowPoints(this.edge.Target);
        this.edge.Bends = edgePoints.slice(1, edgePoints.length - 2);
    }

    public selectEdge() {
        this.stroke = 'orange';
        this.strokeWidth = 2;
    }

    public unselectEdge() {
        this.stroke = 'gray';
        this.strokeWidth = 1;
    }
}

import { GraphEdge } from '../models/edge';
import { GraphPoint } from '../models/point';
import { GraphPort } from '../models/port';
import { Graph } from '../models/graph';
import { ViewModel } from './viewmodel';

export class EdgeViewModel extends ViewModel {
    public edge: GraphEdge;
    public graph: Graph;

    public arrowPoints: string;
    public points: string;
    public stroke: string;
    public strokeWidth: number;
    public selected: boolean;

    constructor(graph: Graph) {
        super();
        this.graph = graph;
        this.stroke = 'gray';
        this.strokeWidth = 1;
        this.selected = false;
    }

    protected getEdge(sourcePort: GraphPort, targetPort: GraphPort): GraphEdge {
        const edge = new GraphEdge(this.graph);
        edge.Source = sourcePort;
        sourcePort.addEdge(edge);
        edge.Target = targetPort;
        targetPort.addEdge(edge);
        return edge;
    }

    public createEdge(sourcePort: GraphPort, targetPort: GraphPort) {
        this.edge = this.getEdge(sourcePort, targetPort);
        const edgePoints = this.graph.layout.getEdgePoints(this.edge);
        this.points = this.getGraphicalPoints(edgePoints);
        this.arrowPoints = this.getArrowPoints(targetPort);
        this.stroke = 'green';
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
    }

    public toggleEdgeSelection() {
        if (this.selected) {
            this.selected = false;
            this.stroke = 'gray';
        } else {
            this.stroke = 'darkorange';
            this.selected = true;
        }
    }

    public Dispose() {

    }
}

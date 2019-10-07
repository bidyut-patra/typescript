import { GraphEdge } from '../models/edge';
import { GraphPoint } from '../models/point';
import { GraphPort } from '../models/port';
import { ElementViewModel } from './elementviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { PortViewModel } from './portviewmodel';

export class EdgeViewModel extends ElementViewModel {
    public edge: GraphEdge;
    public source: PortViewModel;
    public target: PortViewModel;
    public arrowPoints: string;
    public points: string;
    public stroke: string;
    public strokeWidth: number;
    public pathPoints: string;
    public highlighted: boolean;

    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this.stroke = 'gray';
        this.strokeWidth = 1;
        this.highlighted = false;
    }

    protected getEdge(sourcePort: GraphPort, targetPort: GraphPort): GraphEdge {
        const edge = new GraphEdge(this.GraphViewModel.Graph);
        edge.Source = sourcePort;
        sourcePort.addEdge(edge);
        edge.Target = targetPort;
        targetPort.addEdge(edge);
        return edge;
    }

    public createEdge(sourcePort: PortViewModel, targetPort: PortViewModel) {
        this.source = sourcePort;
        this.target = targetPort;
        this.source.addEdge(this);
        this.target.addEdge(this);
        this.edge = this.getEdge(sourcePort.Port, targetPort.Port);
        const edgePoints = this.GraphViewModel.Graph.layout.getEdgePoints(this.edge);
        this.points = this.getGraphicalPoints(edgePoints);
        this.pathPoints = this.getPathPoints(edgePoints);
        this.arrowPoints = this.getArrowPoints(targetPort.Port);
        this.stroke = 'green';
    }

    private getPathPoints(points: GraphPoint[]): string {
        let pointsStr = '';
        points.forEach((p, i) => {
            if (i === 0) {
                pointsStr = 'M' + p.X + ' ' + p.Y + ' ';
            } else {
                pointsStr += 'L' + p.X + ' ' + p.Y + ' ';
            }
        });
        for (let i = points.length - 2; i > 0; i--) {
            const p = points[i];
            if (i === 1) {
                pointsStr += p.X + ' ' + p.Y + ' Z';
            } else {
                pointsStr += 'L' + p.X + ' ' + p.Y + ' ';
            }
        }
        return pointsStr;
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
        const x = targetPort.Location.X - 9;
        const y = targetPort.Location.Y;
        let arrowPointsStr = x + ',' + y + ' ' + x + ',' + (y - factor - 2) + ' ' + (x + factor + 3.5);
        arrowPointsStr += ',' + y + ' ' + x + ',' + (y + factor + 1.5) + ' ' + x + ',' + y;
        return arrowPointsStr;
    }

    public removeEdge() {
        this.edge.Dispose();
    }

    public updateEdge() {
        const edgePoints = this.GraphViewModel.Graph.layout.getEdgePoints(this.edge);
        this.points = this.getGraphicalPoints(edgePoints);
        this.pathPoints = this.getPathPoints(edgePoints);
        this.arrowPoints = this.getArrowPoints(this.edge.Target);
    }

    public updateSourceLocation(x: number, y: number) {
        this.edge.Source.Location = new GraphPoint(x, y);
        this.updateEdge();
    }

    public updateTargetLocation(x: number, y: number) {
        this.edge.Target.Location = new GraphPoint(x, y);
        this.updateEdge();
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
        this.edge.Dispose();
    }
}

import { GraphEdge } from '../models/edge';
import { GraphPoint } from '../models/point';
import { GraphPort } from '../models/port';

export class EdgeViewModel {
    public polyline: SVGPolylineElement;
    public edge: GraphEdge;
    public svg: SVGElement;

    constructor(svg: SVGElement) {
        this.svg = svg;
    }

    private createEdge(points: GraphPoint[], sourcePort: GraphPort, targetPort: GraphPort): GraphEdge {
        const edge = new GraphEdge();
        edge.Source = sourcePort;
        edge.Target = targetPort;
        edge.Bends = points.slice(1, points.length - 2);
        return edge;
    }

    private calculateEdgePoints(sourcePort: GraphPort, targetPort: GraphPort): GraphPoint[] {
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

    public drawEdge(sourcePort: GraphPort, targetPort: GraphPort) {
        const points = this.calculateEdgePoints(sourcePort, targetPort);
        this.edge = this.createEdge(points, sourcePort, targetPort);
        const pointsStr = this.getPointsString(points);
        this.polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        this.polyline.setAttribute('points', pointsStr);
        this.polyline.style.stroke = 'brown';
        this.polyline.style.strokeWidth = '1';
        this.polyline.style.fill = 'none';
        this.svg.appendChild(this.polyline);
    }

    private getPointsString(points: GraphPoint[]): string {
        let pointsStr = '';
        points.forEach(p => {
            pointsStr += p.X + ',' + p.Y + ' ';
        });
        pointsStr = pointsStr.substr(0, pointsStr.length - 1);
        return pointsStr;
    }

    public updateEdge() {
        const points = this.calculateEdgePoints(this.edge.Source, this.edge.Target);
        this.edge.Bends = points.slice(1, points.length - 2);
        const pointsStr = this.getPointsString(points);
        this.polyline.setAttribute('points', pointsStr);
    }
}

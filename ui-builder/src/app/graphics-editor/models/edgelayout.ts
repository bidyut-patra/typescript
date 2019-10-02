import { GraphEdge } from './edge';
import { GraphPoint } from './point';
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
        edge.Points = edgePoints;
        edge.Bends = edgePoints.slice(1, edgePoints.length - 1);
        return edgePoints;
    }

    private calcEdgePoints(edge: GraphEdge): GraphPoint[] {
        const edgePoints: GraphPoint[] = [];
        edgePoints.push(edge.Source.Location);
        const bendPoints = this.getBendPoints(edge.Source.Location, edge.Target.Location);
        bendPoints.forEach(bp => {
            edgePoints.push(bp);
        });
        edgePoints.push(edge.Target.Location);
        return edgePoints;
    }

    private getBendPoints(edgeStart: GraphPoint, edgeEnd: GraphPoint): GraphPoint[] {
        let bendPoints = [];
        for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];
            if ((node.TopLeft.X >= edgeStart.X) && (node.TopRight.X <= edgeEnd.X)) {
                const intersectionPoints = this.getIntersectPointsForNodeSides(edgeStart, edgeEnd, node);
                if (intersectionPoints.length === 2) {
                    const identifiedBendPoints = this.identifyBendPoints(edgeStart, edgeEnd, intersectionPoints);
                    bendPoints = bendPoints.concat(identifiedBendPoints);
                } else {
                    if (intersectionPoints.length === 0) {
                        // there is no intersections with this node
                        continue;
                    } else {
                        throw Error('Incorrect computation of intersection points!!!');
                    }
                }
            }
        }

        if (bendPoints.length === 0) {
            const identifiedBendPoints = this.identifyBendPoints(edgeStart, edgeEnd, []);
            bendPoints = bendPoints.concat(identifiedBendPoints);
        }

        //return this.applyGapBetweenEdgeSegments(bendPoints);
        return bendPoints;
    }

    private applyGapBetweenEdgeSegments(bendPoints: GraphPoint[]) {
        const gap = 10;
        this._edges.forEach(e => {
            e.Bends.forEach(b => {
                for (let i = 0; i < bendPoints.length; i += 2) {
                    const bpFirst = bendPoints[i];
                    const bpSecond = bendPoints[i + 1];
                    if ((bpFirst.X === bpSecond.X) && Math.abs(b.X - bpFirst.X) < gap) {
                        const actualXGap = Math.abs(b.X - bpFirst.X);
                        bpFirst.X += (gap - actualXGap);
                        bpSecond.X += (gap - actualXGap);
                    }

                    if ((bpFirst.Y === bpSecond.Y) && Math.abs(b.Y - bpFirst.Y) < gap) {
                        const actualYGap = Math.abs(b.Y - bpFirst.Y);
                        bpFirst.Y += (gap - actualYGap);
                        bpSecond.Y += (gap - actualYGap);
                    }
                }
            });
        });
        return bendPoints;
    }

    private getIntersectPointsForNodeSides(edgeStart: GraphPoint, edgeEnd: GraphPoint, node: GraphNode) {
        const intersectionPoints = [];

        const topEdgeIntersectionPoint = this.getIntersectPoint(edgeStart, edgeEnd, node.TopLeft, node.TopRight);
        if (topEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'top', point: topEdgeIntersectionPoint }); }
        const leftEdgeIntersectionPoint = this.getIntersectPoint(edgeStart, edgeEnd, node.TopLeft, node.BottomLeft);
        if (leftEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'left', point: leftEdgeIntersectionPoint }); }
        const rightEdgeIntersectionPoint = this.getIntersectPoint(edgeStart, edgeEnd, node.TopRight, node.BottomRight);
        if (rightEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'right', point: rightEdgeIntersectionPoint }); }
        const bottomEdgeIntersectionPoint = this.getIntersectPoint(edgeStart, edgeEnd, node.BottomLeft, node.BottomRight);
        if (bottomEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'bottom', point: bottomEdgeIntersectionPoint }); }

        return intersectionPoints;
    }

    private identifyBendPoints(start: GraphPoint, end: GraphPoint, points: { edge: string, point: GraphPoint }[]): GraphPoint[] {
        const bendPoints = [];
        if (points.length === 0) {
            const x = start.X + (end.X - start.X) / 3;
            bendPoints.push(new GraphPoint(x, start.Y));
            bendPoints.push(new GraphPoint(x, end.Y));
        } else {
            // Generally there will be two intersection points crossing any two edges of the node
            if ((end.X > start.X) && (end.Y > start.Y)) {
                // edge movement from left to right and top-down / bottom-up in y-direction
                const orderedPoints = this.getNearFarPoints(start, points[0], points[1]);
                if ((orderedPoints[0].edge === 'top') && (orderedPoints[1].edge === 'right')) {
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X + 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X + 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'top')) {
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'bottom')) {
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'right')) {
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X + 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X + 50, end.Y));
                } else {

                }
            } else if ((end.X < start.X) && (end.Y < start.Y)) {
                // edge movement from right to left and top-down / bottom-up in y-direction
                const orderedPoints = this.getNearFarPoints(start, points[0], points[1]);
                if ((orderedPoints[0].edge === 'top') && (orderedPoints[1].edge === 'right')) {
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X + 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X + 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'top')) {
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'bottom')) {
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'right')) {
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, end.Y));
                } else {

                }
            } else if ((end.X > start.X) && (end.Y < start.Y)) {
                // edge movement from right to left and top-down / bottom-up in y-direction
                const orderedPoints = this.getNearFarPoints(start, points[0], points[1]);
                if ((orderedPoints[0].edge === 'top') && (orderedPoints[1].edge === 'right')) {
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X + 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X + 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'top')) {
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'bottom')) {
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[1].point.X - 50, end.Y));
                } else if ((orderedPoints[0].edge === 'left') && (orderedPoints[1].edge === 'right')) {
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, start.Y));
                    bendPoints.push(new GraphPoint(orderedPoints[0].point.X - 50, end.Y));
                } else {

                }
            } else {
                // edge movement vertical and top-down / bottom-up in y-direction
            }
        }
        return bendPoints;
    }

    private getNearFarPoints(start: GraphPoint,
                                    point1: { edge: string, point: GraphPoint },
                                    point2: { edge: string, point: GraphPoint }) {
        const distance1 = this.getDistance(start, point1.point);
        const distance2 = this.getDistance(start, point2.point);
        return distance1 < distance2 ? [point1, point2] : [point2, point1];
    }

    private getDistance(point1: GraphPoint, point2: GraphPoint) {
        return Math.sqrt(Math.pow(point1.X - point2.X, 2) + Math.pow(point1.Y - point2.Y, 2));
    }

    private getIntersectPoint(a: GraphPoint, b: GraphPoint, c: GraphPoint, d: GraphPoint): GraphPoint {
        if ((Math.abs(b.X - a.X) > 0) && (Math.abs(b.Y - a.Y) > 0)) {
            const gradient = (b.Y - a.Y) / (b.X - a.X);
            const intercept = a.Y - gradient * a.X;
            // "y = mx + c" where 'm' is gradient & 'c' is intercept
            if (c.X === d.X) {
                const intersect_y = gradient * c.X + intercept;
                if ((intersect_y >= c.Y) && (intersect_y <= d.Y)) {
                    return new GraphPoint(c.X, intersect_y);
                } else {
                    return undefined;
                }
            } else if (c.Y === d.Y) {
                const intersect_x = (c.Y - intercept) / gradient;
                if ((intersect_x >= c.X) && (intersect_x <= d.X)) {
                    return new GraphPoint(intersect_x, c.Y);
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } else if (Math.abs(b.X - a.X) === 0) {
            if (c.Y === d.Y) {
                if ((a.X >= c.X) && (a.X <= d.X)) {
                    return new GraphPoint(a.X, c.Y);
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } else if (Math.abs(b.Y - a.Y) === 0) {
            if (c.X === d.X) {
                if ((a.Y >= c.Y) && (a.Y <= d.Y)) {
                    return new GraphPoint(c.X, a.Y);
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } else {
            // Not applicable for a line, only for a point
            return undefined;
        }
    }
}

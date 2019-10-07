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
        const edgePoints: GraphPoint[] = [];
        edgePoints.push(edge.Source.Location);
        const bendPoints = this.getBendPoints(edge.Source.Location, edge.Target.Location);
        bendPoints.forEach(bp => {
            edgePoints.push(bp);
        });
        edgePoints.push(edge.Target.Location);

        edge.Points = edgePoints;
        edge.Bends = bendPoints;
        edge.Segments = [];

        for (let i = 1; i < edge.Points.length; i++) {
            const start = edge.Points[i - 1];
            const end = edge.Points[i];
            edge.Segments.push({ start: start, end: end });
        }

        return edgePoints;
    }

    private getBendPoints(edgeStart: GraphPoint, edgeEnd: GraphPoint): GraphPoint[] {
        // Identify bend points when there is one or more nodes intersecting the drawing edge
        let bendPoints = this.getBendPointsToAvoidIntersectingNodes(edgeStart, edgeEnd);
        // Calculate simple bend points when there is no node intersecting the drawing edge
        if (bendPoints.length === 0) {
            const identifiedBendPoints = this.getSimpleBendPoints(edgeStart, edgeEnd);
            bendPoints = bendPoints.concat(identifiedBendPoints);
        }
        // Add more bend points if one of the segment of the drawn edge is intersecting node(s)
        const edgePoints = [edgeStart, ...bendPoints, edgeEnd];
        this.getMoreBendPoints(edgePoints, 0);
        return edgePoints.slice(1, edgePoints.length - 1);
    }

    private getMoreBendPoints(edgePoints: GraphPoint[], recursiveLevel: number) {
        let segmentCorrected = false;
        for (let i = 1; i < edgePoints.length; i++) {
            const bendPoints = this.getBendPointsToAvoidIntersectingNodes(edgePoints[i - 1], edgePoints[i]);
            if (bendPoints.length === 1) {
                if (i === edgePoints.length - 1) {
                    const temp = edgePoints[i];
                    edgePoints[i] = bendPoints[0];
                    edgePoints.push(temp);
                } else {
                    edgePoints[i] = bendPoints[0];
                }
                segmentCorrected = true;
                break;
            }
        }

        if (segmentCorrected && (recursiveLevel < 10)) {
            this.getMoreBendPoints(edgePoints, ++recursiveLevel);
        }
    }

    private getBendPointsToAvoidIntersectingNodes(edgeStart: GraphPoint, edgeEnd: GraphPoint) {
        let bendPoints = [];
        const nodesOverlappingEdgeBox = this.getNodesOverlappingEdgeBox(edgeStart, edgeEnd);
        for (let i = 0; i < nodesOverlappingEdgeBox.length; i++) {
            const node = nodesOverlappingEdgeBox[i];
            const intersectionPoints = this.getIntersectPointsForNodeSides(edgeStart, edgeEnd, node);
            if (intersectionPoints.length === 2) {
                const identifiedBendPoints = this.getBendPointsWhenTwoSidesIntersected(edgeStart, edgeEnd, intersectionPoints);
                bendPoints = bendPoints.concat(identifiedBendPoints);
            } else if (intersectionPoints.length === 1) {
                const identifiedBendPoints = this.getBendPointsWhenOneSideIntersected(edgeStart, edgeEnd, intersectionPoints[0]);
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
        return bendPoints;
    }

    private getNodesOverlappingEdgeBox(edgeStart: GraphPoint, edgeEnd: GraphPoint) {
        const nodesOverlappingEdgeBox = [];
        const factor = 20;
        const minX = edgeStart.X > edgeEnd.X ? edgeEnd.X + factor : edgeStart.X + factor;
        const minY = edgeStart.Y > edgeEnd.Y ? edgeEnd.Y + factor : edgeStart.Y + factor;
        const maxX = edgeStart.X > edgeEnd.X ? edgeStart.X - factor : edgeEnd.X - factor;
        const maxY = edgeStart.Y > edgeEnd.Y ? edgeStart.Y - factor : edgeEnd.Y - factor;

        const edgeBoxTopLeft = new GraphPoint(minX, minY);
        const edgeBoxTopRight = new GraphPoint(maxX, minY);
        const edgeBoxBottomRight = new GraphPoint(maxX, maxY);

        for (let i = 0; i < this._nodes.length; i++) {
            const node = this._nodes[i];
            if (((edgeBoxTopLeft.X <= node.TopLeft.X + factor) && (edgeBoxTopRight.X >= node.TopRight.X - factor)) ||
                (edgeBoxTopLeft.lessThanOrEqual(node.TopLeft) && edgeBoxBottomRight.greaterThanOrEqual(node.TopLeft)) ||
                (this.isPointInsideNode(edgeBoxTopLeft, node)) || (this.isPointInsideNode(edgeBoxBottomRight, node))) {
                nodesOverlappingEdgeBox.push(node);
            }
        }
        return nodesOverlappingEdgeBox;
    }

    /**
     * Check if given point is inside node boundary
     *
     * @param point
     * @param node
     */
    private isPointInsideNode(point: GraphPoint, node: GraphNode) {
        const innerOffset = 20;
        const pointInsideNode = (point.X >= (node.TopLeft.X + innerOffset)) && (point.X <= (node.TopRight.X - innerOffset)) &&
                                (point.Y >= (node.TopLeft.Y + innerOffset)) && (point.Y <= (node.BottomRight.Y - innerOffset));
        return pointInsideNode;
    }

    /**
     * Computes the intersection points of the edge with node sides
     *
     * @param edgeStart
     * @param edgeEnd
     * @param node
     */
    private getIntersectPointsForNodeSides(edgeStart: GraphPoint, edgeEnd: GraphPoint, node: GraphNode) {
        const intersectionPoints = [];

        const topEdgeIntersectionPoint = this.getIntersectionPoint(edgeStart, edgeEnd, node.TopLeft, node.TopRight);
        if (topEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'top', point: topEdgeIntersectionPoint }); }
        const leftEdgeIntersectionPoint = this.getIntersectionPoint(edgeStart, edgeEnd, node.TopLeft, node.BottomLeft);
        if (leftEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'left', point: leftEdgeIntersectionPoint }); }
        const rightEdgeIntersectionPoint = this.getIntersectionPoint(edgeStart, edgeEnd, node.TopRight, node.BottomRight);
        if (rightEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'right', point: rightEdgeIntersectionPoint }); }
        const bottomEdgeIntersectionPoint = this.getIntersectionPoint(edgeStart, edgeEnd, node.BottomLeft, node.BottomRight);
        if (bottomEdgeIntersectionPoint) { intersectionPoints.push({ edge: 'bottom', point: bottomEdgeIntersectionPoint }); }

        return intersectionPoints;
    }

    private getSimpleBendPoints(start: GraphPoint, end: GraphPoint): GraphPoint[] {
        const bendPoints = [];
        const factor = 2;
        const x = start.X + (end.X - start.X) / factor;
        const p1 = new GraphPoint(x, start.Y);
        bendPoints.push(p1);
        const p2 = new GraphPoint(x, end.Y);
        bendPoints.push(p2);
        return bendPoints;
    }

    private getBendPointsWhenOneSideIntersected(start: GraphPoint, end: GraphPoint,
                                                ipoint: { edge: string, point: GraphPoint }): GraphPoint[] {
        const bendPoints = [];
        if (ipoint.edge === 'left') {
            bendPoints.push(new GraphPoint(ipoint.point.X - 20, ipoint.point.Y));
            bendPoints.push(new GraphPoint(ipoint.point.X - 20, end.Y));
        } else if (ipoint.edge === 'bottom') {
            bendPoints.push(new GraphPoint(ipoint.point.X, ipoint.point.Y + 20));
        }
        return bendPoints;
    }

    private getBendPointsWhenTwoSidesIntersected(start: GraphPoint, end: GraphPoint,
                                                 ipoints: { edge: string, point: GraphPoint }[]): GraphPoint[] {
        const bendPoints = [];
        const nodeEdgeDistance = 50;
        const points = this.getNearFarPoints(start, ipoints[0], ipoints[1]);
        // Generally there will be two intersection points crossing any two edges of the node
        if (end.X > start.X) {
            if (this.intersectedFromLeftToRight(points[0].edge, points[1].edge)) {
                bendPoints.push(new GraphPoint(points[0].point.X - nodeEdgeDistance, start.Y));
                bendPoints.push(new GraphPoint(points[0].point.X - nodeEdgeDistance, end.Y));
            } else if (this.intersectedFromRightToLeft(points[0].edge, points[1].edge)) {
                bendPoints.push(new GraphPoint(points[0].point.X + nodeEdgeDistance, start.Y));
                bendPoints.push(new GraphPoint(points[0].point.X + nodeEdgeDistance, end.Y));
            } else if (this.intersectedFromTopToBottom(points[0].edge, points[1].edge) ||
                       this.intersectedFromBottomToTop(points[0].edge, points[1].edge)) {
                bendPoints.push(new GraphPoint(points[1].point.X + nodeEdgeDistance, start.Y));
                bendPoints.push(new GraphPoint(points[1].point.X + nodeEdgeDistance, end.Y));
            } else {
                // Right to left is not possible in this case since X co-ordinate is increasing
                throw Error('Incorrect edge direction when X value is increasing !!!');
            }
        } else if (end.X < start.X) {
            if (this.intersectedFromLeftToRight(points[0].edge, points[1].edge)) {
                bendPoints.push(new GraphPoint(points[0].point.X - nodeEdgeDistance, start.Y));
                bendPoints.push(new GraphPoint(points[0].point.X - nodeEdgeDistance, end.Y));
            } else if (this.intersectedFromRightToLeft(points[0].edge, points[1].edge)) {
                bendPoints.push(new GraphPoint(points[0].point.X + nodeEdgeDistance, start.Y));
                bendPoints.push(new GraphPoint(points[0].point.X + nodeEdgeDistance, end.Y));
            } else if (this.intersectedFromTopToBottom(points[0].edge, points[1].edge) ||
                       this.intersectedFromBottomToTop(points[0].edge, points[1].edge)) {
                bendPoints.push(new GraphPoint(points[1].point.X - nodeEdgeDistance, start.Y));
                bendPoints.push(new GraphPoint(points[1].point.X - nodeEdgeDistance, end.Y));
            } else {
                // Left to right is not possible in this case since X co-ordinate is decreasing
                throw Error('Incorrect edge direction when X value is decreasing !!!');
            }
        } else {
            // edge movement vertical and top-down / bottom-up in y-direction
        }
        return bendPoints;
    }

    private intersectedFromLeftToRight(intersectedEdge1: string, intersectedEdge2: string): boolean {
        return (intersectedEdge1 === 'left') &&
        ((intersectedEdge2 === 'top') || (intersectedEdge2 === 'bottom') || (intersectedEdge2 === 'right'));
    }

    private intersectedFromRightToLeft(intersectedEdge1: string, intersectedEdge2: string): boolean {
        return (intersectedEdge1 === 'right') &&
        ((intersectedEdge2 === 'top') || (intersectedEdge2 === 'bottom') || (intersectedEdge2 === 'left'));
    }

    private intersectedFromTopToBottom(intersectedEdge1: string, intersectedEdge2: string): boolean {
        return (intersectedEdge1 === 'top') &&
        ((intersectedEdge2 === 'right') || (intersectedEdge2 === 'bottom') || (intersectedEdge2 === 'left'));
    }

    private intersectedFromBottomToTop(intersectedEdge1: string, intersectedEdge2: string): boolean {
        return (intersectedEdge1 === 'bottom') &&
        ((intersectedEdge2 === 'right') || (intersectedEdge2 === 'top') || (intersectedEdge2 === 'left'));
    }

    /**
     * Sequence points based on near / far from the starting point
     *
     * @param start
     * @param point1
     * @param point2
     */
    private getNearFarPoints(start: GraphPoint,
                             point1: { edge: string, point: GraphPoint },
                             point2: { edge: string, point: GraphPoint }) {
        const distance1 = this.getDistance(start, point1.point);
        const distance2 = this.getDistance(start, point2.point);
        return distance1 < distance2 ? [point1, point2] : [point2, point1];
    }

    /**
     * Gets the distance between two points
     *
     * @param point1
     * @param point2
     */
    private getDistance(point1: GraphPoint, point2: GraphPoint) {
        return Math.sqrt(Math.pow(point1.X - point2.X, 2) + Math.pow(point1.Y - point2.Y, 2));
    }

    /**
     * Gets the intersection point of two lines given their co-ordinates
     *
     * @param a
     * @param b
     * @param c
     * @param d
     */
    private getIntersectionPoint(a: GraphPoint, b: GraphPoint, c: GraphPoint, d: GraphPoint): GraphPoint {
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
                if ((a.X >= c.X) && (a.X <= d.X) && (((a.Y >= c.Y) && (b.Y <= c.Y)) || ((b.Y >= c.Y) && (a.Y <= c.Y)))) {
                    return new GraphPoint(a.X, c.Y);
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } else if (Math.abs(b.Y - a.Y) === 0) {
            if (c.X === d.X) {
                if ((a.Y >= c.Y) && (a.Y <= d.Y) && (((a.X >= c.X) && (b.X <= c.X)) || ((b.X >= c.X) && (a.X <= c.X)))) {
                    return new GraphPoint(c.X, a.Y);
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } else {
            // Not applicable for a point
            return undefined;
        }
    }
}

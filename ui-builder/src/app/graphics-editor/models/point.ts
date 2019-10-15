export class GraphPoint {
    public X: number;
    public Y: number;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    public lessThanOrEqual(point: GraphPoint) {
        return this.X <= point.X && this.Y <= point.Y;
    }

    public greaterThanOrEqual(point: GraphPoint) {
        return this.X >= point.X && this.Y >= point.Y;
    }

    public equal(point: GraphPoint) {
        return this.X === point.X && this.Y === point.Y;
    }

    public between(point1: GraphPoint, point2: GraphPoint) {
        return this.X >= point1.X && this.X <= point2.X;
    }
}

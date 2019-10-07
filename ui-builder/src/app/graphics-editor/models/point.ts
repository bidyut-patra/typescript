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
}

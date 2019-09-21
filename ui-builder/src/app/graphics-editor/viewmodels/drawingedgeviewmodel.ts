import { Graph } from '../models/graph';
import { EdgeViewModel } from './edgeviewmodel';
import { GraphPort } from '../models/port';
import { DrawingEdge } from '../models/drawingedge';

export class DrawingEdgeViewModel extends EdgeViewModel {
    constructor(graph: Graph) {
        super(graph);
    }

    protected getEdge(sourcePort: GraphPort, targetPort: GraphPort): DrawingEdge {
        const edge = new DrawingEdge(this.graph);
        edge.Source = sourcePort;
        sourcePort.addEdge(edge);
        edge.Target = targetPort;
        targetPort.addEdge(edge);
        this.graph.setDrawingEdge(edge);
        return edge;
    }

    public onMove() {
        (<DrawingEdge>this.edge).onMove.emit();
    }

    public Dispose() {
        (<DrawingEdge>this.edge).onDisposed.emit();
    }
}

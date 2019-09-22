import { EdgeViewModel } from './edgeviewmodel';
import { GraphPort } from '../models/port';
import { DrawingEdge } from '../models/drawingedge';
import { GraphViewModel } from './graphviewmodel';

export class DrawingEdgeViewModel extends EdgeViewModel {
    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
    }

    protected getEdge(sourcePort: GraphPort, targetPort: GraphPort): DrawingEdge {
        const edge = new DrawingEdge(this.GraphViewModel.Graph);
        edge.Source = sourcePort;
        sourcePort.addEdge(edge);
        edge.Target = targetPort;
        targetPort.addEdge(edge);
        this.GraphViewModel.Graph.setDrawingEdge(edge);
        return edge;
    }

    public updateTargetLocation(x: number, y: number) {
        super.updateTargetLocation(x, y);
        this.onMove();
    }

    public onMove() {
        (<DrawingEdge>this.edge).onMove.emit();
    }

    public Dispose() {
        (<DrawingEdge>this.edge).onDisposed.emit();
    }
}

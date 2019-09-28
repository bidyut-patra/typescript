import { GraphPort } from './port';
import { GraphPoint } from './point';
import { GraphElement } from './element';
import { Graph } from './graph';

export class GraphEdge extends GraphElement {
    public Source: GraphPort;
    public Target: GraphPort;
    public Bends: GraphPoint[];
    public Points: GraphPoint[];

    public OnSourcePortChanged: Function;
    public OnTargetPortChanged: Function;

    public OnSourcePortRemoved: Function;
    public OnTargetPortRemoved: Function;

    constructor(graph: Graph) {
        super(graph);
        this.Bends = [];
        this.Points = [];
        this.Graph.layout.registerEdge(this);
    }

    public Dispose() {
        this.Graph.layout.unregisterEdge(this);
        this.Source.removeEdge(this);
        this.Target.removeEdge(this);
    }
}

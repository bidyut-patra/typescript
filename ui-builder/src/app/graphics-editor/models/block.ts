import { GraphNode } from './node';
import { GraphPort } from './port';
import { Graph } from './graph';

export class PortSet {
    public DataContext: any;
    public LeftPort: GraphPort;
    public RightPort: GraphPort;
}

export class GraphBlock extends GraphNode {
    public PortSetList: PortSet[];

    constructor(graph: Graph) {
        super(graph);
        this.PortSetList = [];
    }
}

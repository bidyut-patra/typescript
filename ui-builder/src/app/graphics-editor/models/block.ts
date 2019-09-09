import { GraphNode } from './node';
import { GraphPort } from './port';

export class PortSet {
    public DataContext: any;
    public LeftPort: GraphPort;
    public RightPort: GraphPort;
}

export class GraphBlock extends GraphNode {
    public PortSetList: PortSet[];

    constructor() {
        super();
        this.PortSetList = [];
    }
}

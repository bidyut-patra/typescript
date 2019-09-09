import { Guid } from 'src/app/lib/misc/guid';
import { Graph } from './graph';

export class GraphElement {
    public DataContext: any;
    public Id: string;
    public Graph: Graph;

    constructor(graph: Graph) {
        this.Graph = graph;
        this.Id = Guid.guid();
    }
}

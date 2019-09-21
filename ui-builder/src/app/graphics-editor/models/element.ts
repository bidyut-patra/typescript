import { Subscription } from 'rxjs/internal/Subscription';
import { Guid } from 'src/app/lib/misc/guid';
import { Graph } from './graph';
import { IDataContext } from './datacontext';

export class GraphElement implements IDataContext {
    public DataContext: any;
    public Id: string;
    public Graph: Graph;

    protected _subscriptions: Subscription[];

    constructor(graph: Graph) {
        this.Graph = graph;
        this._subscriptions = [];
        this.Id = Guid.guid();
    }

    public Dispose() {
        this._subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }
}

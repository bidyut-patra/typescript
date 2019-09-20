import { EdgeLayout } from './edgelayout';
import { IDataContext } from './datacontext';

export class Graph implements IDataContext {
    public DataContext: any;
    public layout: EdgeLayout;

    constructor() {
        this.layout = new EdgeLayout();
    }
}

import { ElementViewModel } from './elementviewmodel';
import { GraphPort } from '../models/port';
import { GraphViewModel } from './graphviewmodel';
import { EdgeViewModel } from './edgeviewmodel';

export class PortViewModel extends ElementViewModel {
    protected _port: GraphPort;
    protected _connectedEdges: EdgeViewModel[];

    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this._connectedEdges = [];
    }

    protected setPort(port: GraphPort) {
        this._port = port;
        this._port.DataContext = this;
    }

    public get Port() {
        return this._port;
    }

    public get ShowPortCandidate() {
        return this._port ? this._port.ShowPortCandidate : false;
    }

    public get X() {
        return this._port.Location.X;
    }

    public get Y() {
        return this._port.Location.Y;
    }

    public get Id() {
        return this._port.Id;
    }

    public get ConnectedEdges() {
        return this._connectedEdges;
    }

    public addEdge(edgeViewModel: EdgeViewModel) {
        this._connectedEdges.push(edgeViewModel);
    }

    public removeEdge(edgeViewModel: EdgeViewModel) {

    }
}

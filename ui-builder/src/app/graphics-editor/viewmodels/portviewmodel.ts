import { Type } from '@angular/core';
import { ElementViewModel } from './elementviewmodel';
import { GraphPort } from '../models/port';
import { GraphViewModel } from './graphviewmodel';
import { EdgeViewModel } from './edgeviewmodel';
import { NodeViewModel } from './nodeviewmodel';
import { IContextMenuComponent } from '../context-menu-component';
import { PortContextMenuComponent } from '../contextmenus/port-context-menu';

export class PortViewModel extends ElementViewModel {
    protected _port: GraphPort;
    protected _connectedEdges: EdgeViewModel[];
    protected _owner: NodeViewModel;

    public contextMenuComponent: Type<IContextMenuComponent>;

    constructor(graphViewModel: GraphViewModel, owner: NodeViewModel) {
        super(graphViewModel);
        this._connectedEdges = [];
        this._owner = owner;
        this.contextMenuComponent = PortContextMenuComponent;
    }

    protected setPort(port: GraphPort) {
        this._port = port;
        this._port.DataContext = this;
    }

    public get Port() {
        return this._port;
    }

    public get Owner() {
        return this._owner;
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

    public get RelativeX() {
        return this._port.RelativeLocation.X;
    }

    public get RelativeY() {
        return this._port.RelativeLocation.Y;
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

    public Dispose() {
        super.Dispose();
        this._connectedEdges.forEach(e => {
            this._graphViewModel.removeEdge(e);
            e.Dispose();
        });
        this._port.Dispose();
    }
}

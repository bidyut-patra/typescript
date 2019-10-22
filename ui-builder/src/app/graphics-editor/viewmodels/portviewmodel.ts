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
    protected _direction: PortDirection;
    protected _alignment: PortAlignment;

    public contextMenuComponent: Type<IContextMenuComponent>;

    constructor(graphViewModel: GraphViewModel, owner: NodeViewModel) {
        super(graphViewModel);
        this._connectedEdges = [];
        this._owner = owner;
        this._direction = PortDirection.None;
        this._alignment = PortAlignment.None;
        this.contextMenuComponent = PortContextMenuComponent;
    }

    protected setPort(port: GraphPort) {
        this._port = port;
        this._port.DataContext = this;
    }

    public get Direction() {
        return this._direction;
    }

    public get Alignment() {
        return this._alignment;
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

    public canConnect(target: PortViewModel) {
        const canConnect = (this.Direction === PortDirection.Out) && (target.Direction === PortDirection.In);
        return canConnect && this.Port.CanConnect(target.Port);
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

export enum PortDirection {
    In,
    Out,
    None
}

export enum PortAlignment {
    Left,
    Right,
    Top,
    Bottom,
    None
}

import { GraphPort } from './port';
import { GraphPoint } from './point';
import { GraphElement } from './element';
import { Graph } from './graph';
import { GraphSize } from './size';

export class GraphNode extends GraphElement {
    private _location: GraphPoint;

    public Ports: GraphPort[];
    public Size: GraphSize;

    constructor(graph: Graph) {
        super(graph);
        this.Ports = [];
        this._location = new GraphPoint(0, 0);
        this.Graph.layout.registerNode(this);
    }

    public addPort(port: GraphPort) {
        if (port && !this.Ports.find(p => p === port)) {
            port.Owner = this;
            this.Ports.push(port);
        }
    }

    public removePort(port: GraphPort) {
        if (port) {
            const portIndex = this.Ports.findIndex(p => p === port);
            if (portIndex >= 0) {
                this.Ports.splice(portIndex, 1);
            }
        }
    }

    public set Location(value: GraphPoint) {
        this._location = value;
        this.HandlePortsChange();
    }

    public get Location(): GraphPoint {
        return this._location;
    }

    private HandlePortsChange() {
        this.Ports.forEach(port => {
            if (port.OnOwnerLocationChanged) {
                port.OnOwnerLocationChanged();
            }
        });
    }

    public Dispose() {
        this.Ports.forEach(p => {
            p.Dispose();
        });
        this.Ports = [];
        this.Graph.layout.unregisterNode(this);
    }
}

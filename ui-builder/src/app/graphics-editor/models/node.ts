import { GraphPort } from './port';
import { GraphPoint } from './point';
import { GraphElement } from './element';
import { Graph } from './graph';

export class GraphNode extends GraphElement {
    public _location: GraphPoint;
    public Ports: GraphPort[];

    constructor(graph: Graph) {
        super(graph);
        this.Ports = [];
        this._location = new GraphPoint(0, 0);
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
}

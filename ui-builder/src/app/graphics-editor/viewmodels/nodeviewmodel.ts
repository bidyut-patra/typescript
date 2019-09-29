import { GraphNode } from '../models/node';
import { ElementViewModel } from './elementviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { GraphSize } from '../models/size';
import { GraphPoint } from '../models/point';
import { PortViewModel } from './portviewmodel';
import { Guid } from 'src/app/lib/misc/guid';
import { EdgeViewModel } from './edgeviewmodel';

export class NodeViewModel extends ElementViewModel {
    protected _node: GraphNode;
    protected _ports: PortViewModel[];

    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this._ports = [];
    }

    public get Node() {
        return this._node;
    }

    public get Ports() {
        return this._ports;
    }

    public get marginLeft() {
        return this._node.Location.X;
    }

    public get marginTop() {
        return this._node.Location.Y;
    }

    public get Id() {
        return this._node.Id;
    }

    public get Location() {
        return this._node.Location;
    }

    public updateSize(width: number, height: number) {
        this._node.Size = new GraphSize(width, height);
    }

    public updateLocation(x: number, y: number) {
        this._node.Location = new GraphPoint(x, y);
        this._ports.forEach(portViewModel => {
            portViewModel.ConnectedEdges.forEach(connectedEdge => {
                connectedEdge.updateEdge();
            });
        });
    }

    public selectElement() {
        let associatedEdges: EdgeViewModel[] = [];
        this.Ports.forEach(p => {
            associatedEdges = associatedEdges.concat(p.ConnectedEdges);
        });

        associatedEdges.forEach(e => {
            if (e.source.Owner.selected || e.target.Owner.selected) {
                e.stroke = 'blue';
                e.highlighted = true;
            } else {
                if (this.selected) {
                    e.stroke = 'blue';
                    e.highlighted = true;
                } else {
                    e.stroke = 'gray';
                    e.highlighted = false;
                }
            }
        });
    }

    protected initialize(data: any) {
        this._node = new GraphNode(this.GraphViewModel.Graph);
        this._node.Id = data.id ? data.id : Guid.guid();
        this._node.DataContext = data;
        this._node.Location = new GraphPoint(data.marginLeft, data.marginTop);
    }
}

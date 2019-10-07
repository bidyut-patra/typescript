import { Graph } from '../models/graph';
import { EdgeViewModel } from './edgeviewmodel';
import { NodeViewModel } from './nodeviewmodel';
import { ViewModelFactory } from './viewmodelfactory';
import { DrawingEdgeViewModel } from './drawingedgeviewmodel';
import { GraphPort } from '../models/port';
import { PortViewModel } from './portviewmodel';
import { GraphPoint } from '../models/point';
import { DrawingEdgePortViewModel } from './drawingedgeportviewmodel';
import { GraphEdge } from '../models/edge';

export class GraphViewModel {
    // Models
    private _graph: Graph;

    // View Models
    private _nodes: NodeViewModel[];
    private _edges: EdgeViewModel[];
    private _drawingEdge: DrawingEdgeViewModel;
    private _drawingEdgeSourcePort: PortViewModel;

    constructor() {
        this._graph = new Graph();
        this._nodes = [];
        this._edges = [];

        this.initialize();
    }

    private initialize() {
        ViewModelFactory.setGraph(this._graph);
    }

    public get Nodes() {
        return this._nodes;
    }

    public get Edges() {
        return this._edges;
    }

    public get Ports() {
        let ports = [];
        this._nodes.forEach(n => {
            ports = ports.concat(n.Ports);
        });
        return ports;
    }

    public get DrawingEdge() {
        return this._drawingEdge;
    }

    public get Graph() {
        return this._graph;
    }

    public setDrawingEdgeSourcePort(portViewModel: PortViewModel) {
        this._drawingEdgeSourcePort = portViewModel;
    }

    public createDrawingEdge(mouseLocation: any) {
        if (this._drawingEdgeSourcePort) {
            const sourcePort = this._drawingEdgeSourcePort;
            const target = new GraphPort(this.Graph);
            target.Location = mouseLocation;
            const targetPort = new DrawingEdgePortViewModel(this, target);
            this._drawingEdge = new DrawingEdgeViewModel(this);
            this._drawingEdge.createEdge(sourcePort, targetPort);
        }
    }

    public removeDrawingEdge() {
        if (this._drawingEdge) {
            this._drawingEdge.Dispose();
            this._drawingEdge = undefined;
            this._drawingEdgeSourcePort = undefined;
        }
    }

    public loadNodes(nodes: any[]) {
        nodes.forEach(n => {
            this.createNode(n);
        });
    }

    public createNode(node: any) {
        const nodeViewModel = ViewModelFactory.createViewModel(this, node) as NodeViewModel;
        if (nodeViewModel) {
            this._nodes.push(nodeViewModel);
        }
    }

    public removeNode(nodeViewModel: NodeViewModel) {
        if (nodeViewModel) {
            const index = this._nodes.findIndex(n => n === nodeViewModel);
            if (index >= 0) {
                this._nodes.splice(index, 1);
            }
        }
    }

    public convertDrawingEdge(targetEdge: PortViewModel) {
        this.createEdge(this._drawingEdgeSourcePort, targetEdge);
    }

    public loadEdges(edges: any[]) {
        edges.forEach(e => {
            const source = e.source as string;
            const sourceNodeAndPort = source.split('.');
            const target = e.target as string;
            const targetNodeAndPort = target.split('.');
            const sourceNode = this._nodes.find(n => n.Id === sourceNodeAndPort[0]);
            const sourceNodePort = sourceNode.Ports.find(p => p.Id === sourceNodeAndPort[1]);
            const targetNode = this._nodes.find(n => n.Id === targetNodeAndPort[0]);
            const targetNodePort = targetNode.Ports.find(p => p.Id === targetNodeAndPort[1]);
            this.createEdge(sourceNodePort, targetNodePort);
        });
    }

    public createEdge(sourcePort: PortViewModel, targetPort: PortViewModel) {
        const source = sourcePort.Port;
        const target = targetPort.Port;

        if ((source === target) || (target.Owner === undefined)) {
            this.removeDrawingEdge();
        }

        // check if a line is connected between ports
        if (source && target && source.CanConnect(target)) {
            const edgeViewModel = ViewModelFactory.createViewModel(this, {
                type: 'edge',
                source: source,
                target: target
            }) as EdgeViewModel;

            if (edgeViewModel) {
                edgeViewModel.createEdge(sourcePort, targetPort);
                this._edges.push(edgeViewModel);
            }
            this.removeDrawingEdge();
        }
    }

    public removeEdge(edgeViewModel: EdgeViewModel) {
        const edgeIndex = this._edges.findIndex(evm => evm === edgeViewModel);
        if (edgeIndex >= 0) {
            edgeViewModel.removeEdge();
            this._edges.splice(edgeIndex, 1);
        }
    }

    public getNearestPort(mouseLocation: GraphPoint): PortViewModel {
        if (this._drawingEdgeSourcePort === undefined) {
            return undefined;
        }

        let nearestPort: PortViewModel;
        let refMinDistance: number;
        const region = 50;
        for (let i = 0; (i < this.Nodes.length) && !nearestPort; i++) {
            const nodeViewModel = this.Nodes[i];
            if (this._drawingEdgeSourcePort.Port.Owner !== nodeViewModel.Node) {
                for (let j = 0; (j < nodeViewModel.Node.Ports.length); j++) {
                    const port = nodeViewModel.Node.Ports[j];
                    const xPosDiff = Math.abs(port.Location.X - mouseLocation.X);
                    const yPosDiff = Math.abs(port.Location.Y - mouseLocation.Y);
                    const newDistance = xPosDiff + yPosDiff;
                    const nearestPortFound = newDistance < (region * 2);
                    if (nearestPortFound) {
                        if (refMinDistance === undefined) {
                            nearestPort = port.DataContext;
                            refMinDistance = newDistance;
                        } else if (refMinDistance > newDistance) {
                            nearestPort = port.DataContext;
                            refMinDistance = newDistance;
                        } else {
                            // No change in nearest port
                        }
                    }
                }
            }
        }
        return nearestPort;
    }

    public getGraphPoint(clientX: number, clientY: number) {
        const x = this.getMouseXPos(clientX);
        const y = this.getMouseYPos(clientY);
        return new GraphPoint(x, y);
    }

    private getMouseXPos(clientX: number): number {
        return clientX - 305;
    }

    private getMouseYPos(clientY: number): number {
        return clientY - 63;
    }
}

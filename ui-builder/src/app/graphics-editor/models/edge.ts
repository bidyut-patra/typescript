import { GraphPort } from './port';
import { GraphPoint } from './point';
import { GraphElement } from './element';

export class GraphEdge extends GraphElement {
    public Source: GraphPort;
    public Target: GraphPort;
    public Bends: GraphPoint[];

    public OnSourcePortChanged: Function;
    public OnTargetPortChanged: Function;

    public OnSourcePortRemoved: Function;
    public OnTargetPortRemoved: Function;

    constructor() {
        super();
    }
}

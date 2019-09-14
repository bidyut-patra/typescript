import { GraphElement } from '../models/element';
import { GraphPoint } from '../models/point';

export class ContextMenuInfo {
    public title: string;
    public element: GraphElement;
    public location: GraphPoint;
    public display: boolean;
}

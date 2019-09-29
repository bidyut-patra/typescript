import { PortViewModel } from './portviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { GraphPort } from '../models/port';

export class DrawingEdgePortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, port: GraphPort) {
        super(graphViewModel, undefined);
        this.setPort(port);
    }
}

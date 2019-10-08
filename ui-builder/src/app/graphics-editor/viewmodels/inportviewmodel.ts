import { PortViewModel } from './portviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';
import { GraphViewModel } from './graphviewmodel';
import { Guid } from 'src/app/lib/misc/guid';
import { NodeViewModel } from './nodeviewmodel';

export class InPortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, owner: NodeViewModel, data: any) {
        super(graphViewModel, owner);

        this.model = data;
        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Id = data.port.id ? data.port.id : Guid.guid();
        port.Location = new GraphPoint(data.port.xOffset, data.port.yOffset);

        this.setPort(port);
    }
}

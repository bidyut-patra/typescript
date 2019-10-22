import { PortViewModel, PortDirection, PortAlignment } from './portviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';
import { GraphViewModel } from './graphviewmodel';
import { Guid } from 'src/app/lib/misc/guid';
import { NodeViewModel } from './nodeviewmodel';

export class FemalePortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, owner: NodeViewModel, data: any) {
        super(graphViewModel, owner);

        this.model = data;
        this._direction = PortDirection.In;
        this._alignment = PortAlignment.Left;

        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Id = data.leftPort.id ? data.leftPort.id : Guid.guid();
        port.Location = new GraphPoint(data.leftPort.xOffset, data.leftPort.yOffset);

        this.setPort(port);
    }
}

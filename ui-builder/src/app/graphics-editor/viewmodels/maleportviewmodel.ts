import { PortViewModel, PortDirection, PortAlignment } from './portviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';
import { Guid } from 'src/app/lib/misc/guid';
import { NodeViewModel } from './nodeviewmodel';

export class MalePortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, owner: NodeViewModel, data: any) {
        super(graphViewModel, owner);

        this.model = data;
        this._direction = PortDirection.Out;
        this._alignment = PortAlignment.Right;

        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Id = data.rightPort.id ? data.rightPort.id : Guid.guid();
        port.Location = new GraphPoint(data.rightPort.xOffset, data.rightPort.yOffset);

        this.setPort(port);
    }
}

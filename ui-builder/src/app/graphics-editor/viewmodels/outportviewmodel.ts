import { PortViewModel, PortDirection, PortAlignment } from './portviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';
import { Guid } from 'src/app/lib/misc/guid';
import { NodeViewModel } from './nodeviewmodel';

export class OutPortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, owner: NodeViewModel, data: any) {
        super(graphViewModel, owner);

        this.model = data;
        this._direction = PortDirection.Out;
        this._alignment = (this.model.direction === 'RightOut') ? PortAlignment.Right :
                          (this.model.direction === 'BottomOut') ? PortAlignment.Bottom : PortAlignment.None;

        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Id = data.port.id ? data.port.id : Guid.guid();
        port.Location = new GraphPoint(data.port.xOffset, data.port.yOffset);

        this.setPort(port);
    }
}

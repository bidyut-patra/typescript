import { PortViewModel } from './portviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';
import { GraphViewModel } from './graphviewmodel';
import { Guid } from 'src/app/lib/misc/guid';

export class FemalePortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, data: any) {
        super(graphViewModel);

        this.model = data;
        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Id = data.leftPort.id ? data.leftPort.id : Guid.guid();
        port.Location = new GraphPoint(data.leftPort.xOffset, data.leftPort.yOffset);

        this.setPort(port);
    }
}

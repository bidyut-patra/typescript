import { PortViewModel } from './portviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';
import { GraphViewModel } from './graphviewmodel';

export class FemalePortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, data: any) {
        super(graphViewModel);

        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Location = new GraphPoint(data.leftPort.xOffset, data.leftPort.yOffset);
        port.DataContext = data;

        this.setPort(port);
    }
}

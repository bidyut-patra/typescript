import { PortViewModel } from './portviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { GraphPort } from '../models/port';
import { GraphPoint } from '../models/point';

export class MalePortViewModel extends PortViewModel {
    constructor(graphViewModel: GraphViewModel, data: any) {
        super(graphViewModel);

        const port = new GraphPort(this.GraphViewModel.Graph);
        port.Location = new GraphPoint(data.rightPort.xOffset, data.rightPort.yOffset);
        port.DataContext = data;

        this.setPort(port);
    }
}

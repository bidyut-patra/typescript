import { NodeViewModel } from './nodeviewmodel';
import { Guid } from 'src/app/lib/misc/guid';
import { GraphPoint } from '../models/point';
import { GraphViewModel } from './graphviewmodel';
import { InOutPortViewModel } from './inoutportviewmodel';
import { MalePortViewModel } from './maleportviewmodel';
import { FemalePortViewModel } from './femaleportviewmodel';
import { GraphNode } from '../models/node';

export class BlockViewModel extends NodeViewModel {
    private _inOutPorts: InOutPortViewModel[];

    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this._inOutPorts = [];
    }

    public get InOutPorts() {
        return this._inOutPorts;
    }

    protected initialize(block: any) {
        this._node = new GraphNode(this.GraphViewModel.Graph);
        this._node.Id = Guid.guid();
        this._node.DataContext = block;
        this._node.Location = new GraphPoint(block.marginLeft, block.marginTop);
        block.content.forEach(c => {
            if (c.type === 'member') {
                if (c.direction === 'InOut') {
                    const leftPort = new FemalePortViewModel(this.GraphViewModel, c);
                    this._ports.push(leftPort);
                    this._node.addPort(leftPort.Port);

                    const rightPort = new MalePortViewModel(this.GraphViewModel, c);
                    this._ports.push(rightPort);
                    this._node.addPort(rightPort.Port);

                    const inOutPortViewModels = new InOutPortViewModel();
                    inOutPortViewModels.DataContext = c;
                    inOutPortViewModels.LeftPort = leftPort;
                    inOutPortViewModels.RightPort = rightPort;

                    this._inOutPorts.push(inOutPortViewModels);
                }
            }
        });
    }
}

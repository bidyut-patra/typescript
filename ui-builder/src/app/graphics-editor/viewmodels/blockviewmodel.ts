import { NodeViewModel } from './nodeviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { InOutPortViewModel } from './inoutportviewmodel';
import { MalePortViewModel } from './maleportviewmodel';
import { FemalePortViewModel } from './femaleportviewmodel';

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
        super.initialize(block);
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

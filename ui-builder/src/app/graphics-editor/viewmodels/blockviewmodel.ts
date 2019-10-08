import { NodeViewModel } from './nodeviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { InOutPortViewModel } from './inoutportviewmodel';
import { MalePortViewModel } from './maleportviewmodel';
import { FemalePortViewModel } from './femaleportviewmodel';
import { BlockComponent } from '../blocks/block.component';
import { BlockContextMenuComponent } from '../contextmenus/block-context-menu';

export class BlockViewModel extends NodeViewModel {
    private _inOutPorts: InOutPortViewModel[];

    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this._inOutPorts = [];
        this.component = BlockComponent;
        this.contextMenuComponent = BlockContextMenuComponent;
    }

    public get InOutPorts() {
        return this._inOutPorts;
    }

    protected initialize(block: any) {
        super.initialize(block);
        block.content.forEach(c => {
            if (c.type === 'member') {
                if (c.direction === 'InOut') {
                    const leftPort = new FemalePortViewModel(this.GraphViewModel, this, c);
                    this._ports.push(leftPort);
                    this._node.addPort(leftPort.Port);

                    const rightPort = new MalePortViewModel(this.GraphViewModel, this, c);
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

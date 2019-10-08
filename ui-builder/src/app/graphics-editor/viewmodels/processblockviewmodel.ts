import { BlockViewModel } from './blockviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { ProcessComponent } from '../blocks/process.component';
import { InPortViewModel } from './inportviewmodel';
import { OutPortViewModel } from './outportviewmodel';

export class ProcessBlockViewModel extends BlockViewModel {
    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this.component = ProcessComponent;
    }

    protected initialize(process: any) {
        super.initialize(process);
        process.content.forEach(c => {
            if (c.type === 'pin') {
                if (c.direction === 'In') {
                    const inPort = new InPortViewModel(this.GraphViewModel, this, c);
                    this._ports.push(inPort);
                    this._node.addPort(inPort.Port);
                } else if (c.direction === 'Out') {
                    const outPort = new OutPortViewModel(this.GraphViewModel, this, c);
                    this._ports.push(outPort);
                    this._node.addPort(outPort.Port);
                } else {}
            }
        });
    }
}

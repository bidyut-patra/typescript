import { BlockViewModel } from './blockviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { InPortViewModel } from './inportviewmodel';
import { OutPortViewModel } from './outportviewmodel';
import { DecisionComponent } from '../blocks/decision.component';

export class DecisionBlockViewModel extends BlockViewModel {
    constructor(graphViewModel: GraphViewModel) {
        super(graphViewModel);
        this.component = DecisionComponent;
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

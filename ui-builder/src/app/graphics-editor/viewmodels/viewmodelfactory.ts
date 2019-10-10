import { Type } from '@angular/compiler';

import { Graph } from '../models/graph';
import { ElementViewModel } from './elementviewmodel';
import { BlockViewModel } from './blockviewmodel';
import { EdgeViewModel } from './edgeviewmodel';
import { GraphViewModel } from './graphviewmodel';
import { ProcessBlockViewModel } from './processblockviewmodel';
import { DecisionBlockViewModel } from './decisionblockviewmodel';

export class ViewModelFactory {
    private static _typeRegistry: any = {};
    private static _graph: Graph;

    public static setGraph(graph: Graph) {
        this._graph = graph;
    }

    public static registerType(modelType: string, viewModelType: Type) {
        this._typeRegistry[modelType] = viewModelType;
    }

    public static createViewModel(graphViewModel: GraphViewModel, data: any): ElementViewModel {
        let viewModel: ElementViewModel;
        switch (data.type) {
            case '2ioblock':
                viewModel = new BlockViewModel(graphViewModel);
                break;
            case '3ioblock':
                viewModel = new BlockViewModel(graphViewModel);
                break;
            case 'process':
                viewModel = new ProcessBlockViewModel(graphViewModel);
                break;
            case 'decision':
                viewModel = new DecisionBlockViewModel(graphViewModel);
                break;
            case 'edge':
                viewModel = new EdgeViewModel(graphViewModel);
                break;
            default:
                break;
        }

        viewModel.buildElement(data);

        return viewModel;
    }
}

import { GraphViewModel } from './graphviewmodel';

export class ElementViewModel {
    private _graphViewModel: GraphViewModel;
    private _dataContext: any;

    public selected: boolean;

    constructor(graphViewModel: GraphViewModel) {
        this._graphViewModel = graphViewModel;
        this.selected = false;
    }

    protected get GraphViewModel(): GraphViewModel {
        return this._graphViewModel;
    }

    public get DataContext() {
        return this._dataContext;
    }

    protected initialize(modelData: any) {

    }

    public buildElement(modelData: any) {
        this._dataContext = modelData;
        this.initialize(modelData);
    }

    public Dispose() {

    }
}

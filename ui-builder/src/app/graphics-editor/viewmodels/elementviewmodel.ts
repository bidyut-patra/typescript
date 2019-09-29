import { GraphViewModel } from './graphviewmodel';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

export class ElementViewModel {
    private _graphViewModel: GraphViewModel;
    private _dataContext: any;
    private _subscriptions: Subscription[];

    public selected: boolean;
    public model: any;
    public onSelect: EventEmitter<any>;

    constructor(graphViewModel: GraphViewModel) {
        this._graphViewModel = graphViewModel;
        this.selected = false;
        this.onSelect = new EventEmitter<any>();

        this._subscriptions = [];

        const s = this.onSelect.subscribe(() => {
            this.selectElement();
        });
        this._subscriptions.push(s);
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

    public selectElement() {

    }

    public Dispose() {
        this._subscriptions.forEach(s => s.unsubscribe());
    }
}

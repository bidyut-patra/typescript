import { Injectable, Inject } from '@angular/core';
import { ObservableModel, Model } from './observable.model';

@Injectable()
export class ObservableManager {
    constructor() {

    }

    public transformOnLoad<T>(obserables: ObservableModel<any>[], callback: Function): ObservableModel<T> {
        const newObservable: ObservableModel<T> = new ObservableModel<any>({});
        if (obserables && (obserables.length > 0)) {
            const observablesData: any[] = [];
            obserables.forEach((observable, index) => {
                observable.transformOnLoad(data => {
                    observablesData.splice(index, 0, data);
                    if (observablesData.length === obserables.length) {
                        const transformedData = callback(observablesData, obserables.length);
                        newObservable.next(new Model<any>(transformedData, true));
                    }
                });
            });
        }
        return newObservable;
    }
}

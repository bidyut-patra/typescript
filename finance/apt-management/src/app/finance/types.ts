import { ObservableModel } from '../utlities/observablemodel';

export interface ITypes {
    owners: ObservableModel<any[]>;
    paymentTypes: ObservableModel<any[]>;
    transactionTypes: ObservableModel<any[]>;
}

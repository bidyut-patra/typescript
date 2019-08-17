import { Observable, BehaviorSubject } from 'rxjs';
import { HttpErrorHandler } from './http-error';

export class ObservableModel<T> extends BehaviorSubject<Model<T>> {
    private transformOnLoadEvent: Function;
    private initialValue: T;
    private resetValue: T;

    constructor(value: T) {
        super(new Model<T>(value));
        this.initialValue = this.deepCopy(value);
    }

    public initialize(value: T) {
        this.next(new Model<T>(value));
        this.resetValue = this.deepCopy(value);
    }

    public reset() {
        this.next(new Model<T>(this.resetValue));
        this.resetValue = this.deepCopy(this.resetValue);
    }

    public clear() {
        this.next(new Model<T>(this.initialValue));
        this.initialValue = this.deepCopy(this.initialValue);
    }

    private deepCopy(value: any) {
        return JSON.parse(JSON.stringify(value));
    }

    public transform(transform: Function) {
        if (transform) {
            const transformedValue = transform(this.getValue().data);
            this.next(new Model<T>(this.deepCopy(transformedValue), true));
        }
    }

    public transformOnLoad(transformOnLoadEvent: Function) {
        this.transformOnLoadEvent = transformOnLoadEvent;
    }

    public updateResponseAsync(httpObservable: Observable<any>) {
        httpObservable.subscribe(successResponse => {
            if (this.transformOnLoadEvent) {
                const transformedValue = this.transformOnLoadEvent(successResponse);
                this.updateSuccess(transformedValue, undefined);
            } else {
                this.updateSuccess(successResponse, undefined);
            }
        },
        errorResponse => {
            if (errorResponse.status === 401) {
                HttpErrorHandler.publish(errorResponse);
            } else {
                this.updateFailure(errorResponse, 'ERROR');
            }
        });
    }

    private updateSuccess(value: T, message: string) {
        this.next(new Model<T>(value, false, true, false, message));
    }

    private updateFailure(value: T, message: string) {
        this.next(new Model<T>(value, false, false, true, message));
    }
}

export class Model<T> {
    public data: T;
    public cacheUpdate: boolean = undefined;
    public error: boolean = undefined;
    public success: boolean = undefined;
    public message: string = undefined;

    constructor(data: T, cacheUpdate?: boolean, success?: boolean, error?: boolean, message?: string) {
        this.data = data;
        this.cacheUpdate = cacheUpdate;
        this.success = success;
        this.error = error;
        this.message = message;
    }
}

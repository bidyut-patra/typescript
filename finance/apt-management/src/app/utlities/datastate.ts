export class DataState<T> {
    public data: T;
    public loaded: boolean;
    public cached: boolean;
    public error: boolean;

    constructor(data: T, loaded: boolean, error: boolean, cached: boolean) {
        this.data = data;
        this.loaded = loaded;
        this.error = error;
        this.cached = cached;
    }
}

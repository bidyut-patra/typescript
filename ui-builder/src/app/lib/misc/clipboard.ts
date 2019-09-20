import { Injectable } from '@angular/core';

@Injectable()
export class Clipboard {
    private _data: any[];

    constructor() {
        this._data = [];
    }

    /**
     * name
     */
    public Push(data: any) {
        this._data.push(data);
    }

    /**
     * Pop
     */
    public Pop(): any {
        return this._data.pop();
    }
}

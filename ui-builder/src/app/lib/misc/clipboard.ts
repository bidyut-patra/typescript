import { Injectable } from '@angular/core';

@Injectable()
export class Clipboard {
    private _data: any[];

    constructor() {
        this._data = [];
    }

    /**
     * Save to clipboard
     */
    public Push(data: any) {
        this._data = [];
        this._data.push(data);
    }

    /**
     * Get clipboard data
     */
    public Read() {
        return this._data;
    }

    /**
     * Pop from clipboard
     */
    public Pop(): any {
        return this._data.pop();
    }
}

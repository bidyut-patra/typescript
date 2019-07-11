import { Injectable } from '@angular/core';

@Injectable()
export class ControlRegistry {
    private registry: any;

    constructor() {
        this.registry = {};
    }

    public contains(controlId: string): boolean {
        return (this.registry[controlId] === undefined) ? false : true;
    }

    public register(controlId: string) {
        this.registry[controlId] = {};
    }

    public unregister(controlId: string) {
        this.registry[controlId] = undefined;
    }

    public clearAll() {
        this.registry = {};
    }
}

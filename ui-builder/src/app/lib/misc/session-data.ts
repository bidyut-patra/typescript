import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorage<T> {
    public add(key: string, value: T) {
        this.isStringType(value) ? sessionStorage.setItem(key, <any>value) : sessionStorage.setItem(key, JSON.stringify(value));
    }

    public remove(key: string): T {
        const dataItem = sessionStorage.getItem(key);
        sessionStorage.removeItem(key);
        return this.isStringType(dataItem) ? <any>dataItem : <T>JSON.parse(dataItem);
    }

    public getValue(key: string): T {
        const dataItem = sessionStorage.getItem(key);
        return this.isStringType(dataItem) ? <any>dataItem : <T>JSON.parse(dataItem);
    }

    public exists(key: string): boolean {
        return (sessionStorage.getItem(key) !== undefined) &&
        (sessionStorage.getItem(key) !== null) &&
        (sessionStorage.getItem(key) !== '');
    }

    private isStringType(dataItem) {
        return typeof(dataItem) === 'string';
    }
}



import { EventEmitter } from '@angular/core';

export class CommonEventHandler {
    private _ctrlKeyPressed: boolean;
    private _shiftKeyPressed: boolean;
    private _altKeyPressed: boolean;
    private _clickedLocation: any;
    private _mouseLocation: any;
    private _domElement: HTMLElement;

    public onMouseMove: EventEmitter<{ x: number, y: number }>;

    constructor (domElement: HTMLElement) {
        this._domElement = domElement;
        this._ctrlKeyPressed = false;
        this._shiftKeyPressed = false;
        this._altKeyPressed = false;
        this.onMouseMove = new EventEmitter<{ x: number, y: number }>();
    }

    public initialize() {
        if (this._domElement) {

            const thisObj = this;

            this._domElement.onkeydown = function(event: KeyboardEvent) {
                thisObj._ctrlKeyPressed = event.ctrlKey;
                thisObj._altKeyPressed = event.altKey;
                thisObj._shiftKeyPressed = event.shiftKey;
            };

            this._domElement.onkeyup = function(event: KeyboardEvent) {
                thisObj._ctrlKeyPressed = event.ctrlKey;
                thisObj._altKeyPressed = event.altKey;
                thisObj._shiftKeyPressed = event.shiftKey;
            };

            this._domElement.onclick = function(event: MouseEvent) {
                thisObj._clickedLocation = {
                    x: event.clientX,
                    y: event.clientY
                };
            };

            this._domElement.onmousemove = function(event: MouseEvent) {
                thisObj._mouseLocation = {
                    x: event.clientX,
                    y: event.clientY
                };
                thisObj.onMouseMove.emit(thisObj._mouseLocation);
            };
        }
    }

    public get CtrlKeyPressed(): boolean {
        return this._ctrlKeyPressed;
    }

    public get AltKeyPressed(): boolean {
        return this._altKeyPressed;
    }

    public get ShiftKeyPressed(): boolean {
        return this._shiftKeyPressed;
    }

    public get ClickedLocation(): { x: number, y: number } {
        return this._clickedLocation;
    }

    public get MouseLocation(): { x: number, y: number } {
        return this._mouseLocation;
    }

    public Dispose() {
        if (this._domElement) {
            this._domElement.onkeypress = null;
            this._domElement.onkeydown = null;
            this._domElement.onkeyup = null;
            this._domElement.onclick = null;
            this._domElement.onmousemove = null;
        }
    }
}

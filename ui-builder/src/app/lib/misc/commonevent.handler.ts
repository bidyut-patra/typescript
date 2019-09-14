export class CommonEventHandler {
    private _ctrlKeyPressed: boolean;
    private _shiftKeyPressed: boolean;
    private _altKeyPressed: boolean;
    private _domElement: HTMLElement;

    constructor (domElement: HTMLElement) {
        this._domElement = domElement;
        this._ctrlKeyPressed = false;
        this._shiftKeyPressed = false;
        this._altKeyPressed = false;
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

    public Dispose() {
        if (this._domElement) {
            this._domElement.onkeypress = null;
            this._domElement.onkeydown = null;
            this._domElement.onkeyup = null;
        }
    }
}

import { Control, ControlFactory } from './control';
import { FormGroup, FormBuilder } from '@angular/forms';

export class Page {
    private form: FormGroup;
    public controls: Array<Control>;

    constructor() {
        this.controls = [];
        const formBuilder = new FormBuilder();
        this.form = formBuilder.group({});
    }

    public initialize(metaContent: any[]) {
        metaContent.forEach(controlMeta => {
            this.createControl(controlMeta);
        });
    }

    private createControl(controlMeta: any) {
        const control: Control = ControlFactory.createControl(controlMeta);
        if (control != null) {
            control.initialize(controlMeta);
            this.controls.push(control);
            this.form.addControl(control.id, control.getFormControl());
        }
    }

    public getFormGroup(): FormGroup {
        return this.form;
    }
}

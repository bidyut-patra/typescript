import { FormControl, FormBuilder, Validators, AbstractControl, FormArray, ValidatorFn, FormGroup } from '@angular/forms';

export interface IControlConfig {
    id: string;
    type: string;
    label: string;
}

export interface IControlValidation {
    error: string;
}

export interface IBasicControlConfig extends IControlConfig, IControlValidation {
    value: any;
    required: boolean;
}

export interface IContentControlConfig extends IControlConfig {
    childs: any[];
    collapsable: false;
}

export interface IMultiValueControlConfig extends IBasicControlConfig {
    values: any[];
}

export abstract class Control {
    public id: string;
    public type: string;
    public label: string;
    public disabled: boolean;
    public control: AbstractControl;

    constructor() {
    }

    public initialize(metaData: IControlConfig) {
        this.id = metaData.id;
        this.type = metaData.type;
        this.label = metaData.label;
    }

    public getFormControl(): AbstractControl {
        const formBuilder = new FormBuilder();
        return formBuilder.group({});
    }
}

export class BasicControl<T> extends Control {
    public defaultValue: T;
    public currentValue: T;
    public required: boolean;
    public disabled: boolean;
    public error: string;

    constructor() {
        super();
        this.required = false;
        this.disabled = false;
    }

    public initialize(metaData: IBasicControlConfig) {
        super.initialize(metaData);
        this.defaultValue = metaData.value;
        this.currentValue = metaData.value;
        this.required = metaData.required;
        this.error = metaData.error;
    }

    public getFormControl(): AbstractControl {
        const formBuilder = new FormBuilder();
        const formState = {
            value: this.defaultValue,
            disabled: this.disabled
        };
        const validatorErrors = this.required ? Validators.required : null;
        const formControl = formBuilder.control(formState, validatorErrors);
        this.control = formControl;
        return formControl;
    }
}

export class TextControl extends BasicControl<string> {

}

export class MultiValueControl extends BasicControl<any[]> {
    public values: any[];

    public initialize(metaData: IMultiValueControlConfig) {
        super.initialize(metaData);
        this.values = metaData.values;
    }
}

export class MultiSelectionControl extends MultiValueControl {
    public getFormControl(): AbstractControl {
        const formBuilder = new FormBuilder();
        const validatorErrors = this.required ? this.minSelectedCheckBoxes(1) : null;
        const controlsConfig = [];
        this.values.forEach(val => {
            const isSelected = this.defaultValue === val;
            controlsConfig.push(formBuilder.control({
                value: isSelected,
                disabled: this.disabled
            }));
        });
        const formArray = formBuilder.array(controlsConfig, validatorErrors);
        this.control = formArray;
        return formArray;
    }

    private minSelectedCheckBoxes(min = 1): ValidatorFn {
        const validatorFn: ValidatorFn = (formArray: FormArray) => {
            const totalSelected = formArray.controls
            .map(control => control.value)
            .reduce((prev, next) => next ? next + prev : prev, 0);
            return totalSelected >= min ? null : { required: true };
        };
        return validatorFn;
    }
}

export class ComboControl extends MultiValueControl {

}

export class RadioControl extends MultiValueControl {

}

export class CheckControl extends MultiSelectionControl {

}

export class ContentControl extends Control {
    public Childs: Array<Control>;

    constructor() {
        super();
        this.Childs = [];
    }

    public initialize(metaData: IContentControlConfig) {
        super.initialize(metaData);
        if ((metaData.childs !== undefined) && (metaData.childs.length > 0)) {
            metaData.childs.forEach(child => {
                const childControl = ControlFactory.createControl(child);
                childControl.initialize(child);
                this.Childs.push(childControl);
            });
        }
    }

    public getFormControl(): AbstractControl {
        const formBuilder = new FormBuilder();
        const formGroup = formBuilder.group({});
        this.Childs.forEach(child => {
            formGroup.addControl(child.id, child.getFormControl());
        });
        return formGroup;
    }
}

export class ControlFactory {
    public static createControl(controlMeta: any) {
        let control: Control;
        switch (controlMeta.type) {
            case 'text':
                control = new TextControl();
                break;
            case 'combo':
                control = new ComboControl();
                break;
            case 'check':
                control = new CheckControl();
                break;
            case 'radio':
                control = new RadioControl();
                break;
            case 'section':
                control = new ContentControl();
                break;
            default:
                control = null;
        }
        return control;
    }
}

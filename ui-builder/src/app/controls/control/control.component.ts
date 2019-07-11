import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class ControlComponent {
    @Input() public control: any;
    @Input() public metadata: any;
    @Input() public formGroup: FormGroup;

    get formControls() {
        return this.formGroup.controls;
    }
}

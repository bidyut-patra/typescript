import { Component } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
    selector: 'app-textbox',
    template: `<div class="form-group" [formGroup]="formGroup">
                    <label>{{control.label}}:</label>
                    <input type='text' formControlName="{{control.id}}"
                        [ngClass]="{ 'is-invalid': formControls[control.id].errors }"
                        class="form-control" [value]="control.defaultValue"/>
                    <div *ngIf="formControls[control.id].errors" class="invalid-feedback">
                        <div *ngIf="formControls[control.id].errors.required">Name is required</div>
                    </div>
                </div>`
})
export class TextboxComponent extends ControlComponent {

}

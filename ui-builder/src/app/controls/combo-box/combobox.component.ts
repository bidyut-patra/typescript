import { Component } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
    selector: 'app-combobox',
    template: `<div class="form-group" [formGroup]="formGroup">
                    <label>{{control.label}}:</label>
                    <select formControlName="{{control.id}}" class="form-control"
                        [ngClass]="{ 'is-invalid': formControls[control.id].errors }">
                        <option *ngFor="let val of control.values"
                            [selected]="val === control.defaultValue">{{val}}
                        </option>
                    </select>
                    <div *ngIf="formControls[control.id].errors" class="invalid-feedback">
                        <div *ngIf="formControls[control.id].errors.required">Gender is required</div>
                    </div>
                </div>`
})
export class ComboboxComponent extends ControlComponent {

}

import { Component } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
    selector: 'app-checkbox',
    template: `<div class="form-group" [formGroup]="formGroup">
                    <label>{{control.label}}:</label>
                    <div class="form-control" [ngClass]="{ 'is-invalid': formControls[control.id].errors }">
                        <div class="form-check-control"
                            *ngFor="let val of control.values; let i = index"
                            formArrayName = "{{control.id}}">
                            <input type='checkbox' formControlName="{{i}}"/>{{val}}
                        </div>
                    </div>
                    <div *ngIf="formControls[control.id].errors" class="invalid-feedback">
                        <div *ngIf="formControls[control.id].errors.required">{{control.error}}</div>
                    </div>
                </div>`,
    styleUrls: ['./checkbox.css']
})
export class CheckboxComponent extends ControlComponent {

}

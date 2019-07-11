import { Component } from '@angular/core';
import { ControlComponent } from '../control/control.component';

@Component({
    selector: 'app-radiobutton',
    template: `<div class="form-group" [formGroup]="formGroup">
                    <label>{{control.label}}:</label>
                    <div class="form-control" [ngClass]="{ 'is-invalid': formControls[control.id].errors }">
                        <div class="form-radio-control" *ngFor="let val of control.values">
                            <input name="{{control.id}}" type='radio' formControlName="{{control.id}}"
                                [value]="val" [checked]="control.defaultValue === val"/>{{val}}
                        </div>
                    </div>
                    <div *ngIf="formControls[control.id].errors" class="invalid-feedback">
                        <div *ngIf="formControls[control.id].errors.required">Age range is required</div>
                    </div>
                </div>`,
    styleUrls: ['./radio.css']
})
export class RadioComponent extends ControlComponent {

}

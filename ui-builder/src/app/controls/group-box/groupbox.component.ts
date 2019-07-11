import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlComponent } from '../control/control.component';
import { ContentControl } from 'src/app/models/control';

@Component({
    selector: 'app-groupbox',
    template: `<div id="accordion" class="panel-group panel-border">
                <div class="form-group panel panel-default" [formGroup]="formGroup">
                    <div class="panel-heading panel-heading-custom">
                        <h4 class="panel-title">
                            <a data-toggle="collapse"
                               data-parent="#accordion"
                               data-target="#{{control.id}}"
                               href="#{{control.id}}">
                                {{control.label}}
                            </a>
                        </h4>
                    </div>
                    <div id="{{control.id}}" class="row panel-expand expand panel-content" [formGroup]="formGroup">
                        <div [ngClass]="{ 'col-md-6' : childControl.Childs === undefined, 'col-md-12': childControl.Childs != undefined }"
                             *ngFor="let childControl of control.Childs">
                            <ng-template [appControl]='childControl'
                                         [appControlFormGroup]='formGroup'
                                         [appControlMetadata]='metadata'>
                            </ng-template>
                        </div>
                    </div>
                </div>
                </div>`,
    styleUrls: ['./groupbox.css']
})
export class GroupBoxComponent extends ControlComponent implements OnInit {
    ngOnInit() {
    }
}

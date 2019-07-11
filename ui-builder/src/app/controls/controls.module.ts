import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextboxComponent } from './text-box/textbox.component';
import { CheckboxComponent } from './check-box/checkbox.component';
import { RadioComponent } from './radio-button/radio.component';
import { ComboboxComponent } from './combo-box/combobox.component';
import { ControlRegistry } from './control/control.registry';
import { GroupBoxComponent } from './group-box/groupbox.component';
import { SharedModule } from './shared.module';

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        TextboxComponent,
        CheckboxComponent,
        RadioComponent,
        ComboboxComponent,
        GroupBoxComponent
    ],
    providers: [
        ControlRegistry
    ],
    entryComponents: [
        TextboxComponent,
        CheckboxComponent,
        RadioComponent,
        ComboboxComponent,
        GroupBoxComponent
    ]
})
export class ControlsModule {

}

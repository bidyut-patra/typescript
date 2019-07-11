import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlDirective } from './control/control.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        ControlDirective
    ],
    declarations: [
        ControlDirective
    ]
})
export class SharedModule {}

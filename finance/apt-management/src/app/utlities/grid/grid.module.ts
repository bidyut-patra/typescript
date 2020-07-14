import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { GridDirective } from './grid.directive';
import { GridCellComponent } from './grid-cell';

@NgModule({
    imports: [CommonModule],
    declarations: [
        GridComponent,
        GridCellComponent,
        GridDirective
    ],
    exports: [GridComponent]
})
export class GridModule {

}

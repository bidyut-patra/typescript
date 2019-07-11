import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from './navigation.component';

@NgModule({
    imports: [RouterModule],
    exports: [NavigationComponent],
    declarations: [NavigationComponent],
    providers: []
})
export class NavigationModule {
}

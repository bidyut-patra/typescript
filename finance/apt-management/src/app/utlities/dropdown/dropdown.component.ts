import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.html',
    styleUrls: ['.dropdown.scss']
})
export class DropdownComponent {
    @Input('data') data: any[];

    constructor() {
        this.data = [];
    }
}

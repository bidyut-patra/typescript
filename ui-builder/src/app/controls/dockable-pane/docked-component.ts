import { EventEmitter } from '@angular/core';

export interface IDockedComponent {
    title: string;
    footer: string;
    active: boolean;
    width: number;
    height: number;
    data: any;
    action: EventEmitter<any>;
}

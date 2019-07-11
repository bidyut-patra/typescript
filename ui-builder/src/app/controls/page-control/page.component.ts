import { Component, Input, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as metadata from '../controls.metadata.json';

@Component({
    selector: 'app-page-control',
    templateUrl: './page.html',
    styleUrls: ['./page.css']
})
export class PageComponent implements OnInit {
    @Input('page') page: Page;

    public formGroup: FormGroup;
    public controlMetadata: Observable<any>;
    public md: any;

    constructor(private httpClient: HttpClient) {

    }

    get formControls() {
        return this.formGroup.controls;
    }

    get formJson() {
        return JSON.stringify(this.formGroup.value);
    }

    ngOnInit() {
        this.formGroup = this.page.getFormGroup();
        this.controlMetadata = this.httpClient.get('controls/control.metadata.json');
        this.md = metadata;
    }
}

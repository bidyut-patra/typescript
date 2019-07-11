import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page } from '../models/page';

@Component({
    selector: 'app-build-ui',
    templateUrl: './build-ui.html',
    styleUrls: ['./build-ui.css']
})
export class BuildUiComponent implements OnDestroy, OnInit, AfterViewInit {
    private page: Page;
    private message: string;
    private showSpinner: boolean;

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.message = 'Loading data from server...';
        this.showSpinner = true;
        const layoutsObservable = this.http.get('http://localhost:59039/layouts');
        layoutsObservable.subscribe(result => {
            this.page = new Page();
            this.page.initialize(<any[]>result);
        },
        error => {
            setTimeout(() => {
                this.message = 'Error during data load from server';
                this.showSpinner = false;
            }, 200);
        });
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

    }
}

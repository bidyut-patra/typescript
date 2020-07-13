import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionViewerComponent } from './transaction-viewer.component';
declare var $: any;

@Component({
    selector: 'app-transaction-details',
    templateUrl: './transaction-details.html',
    styleUrls: ['./transaction-details.scss']
})
export class TransactionDetailsComponent implements OnInit, OnChanges {
    @ViewChildren('fileInputs') fileInputs: QueryList<ElementRef>;

    public submitted: boolean;
    public form: FormGroup;

    constructor(private modalService: NgbModal) {

    }

    public get f() {
        return this.form.controls;
    }

    public get files() {
        return (<FormArray>this.form.controls['files']).controls;
    }

    ngOnInit() {
        this.form = new FormBuilder().group({
            'files': new FormArray([])
        });
        this.addTransaction();
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    public addTransaction() {
        const files = <FormArray>this.form.controls['files'];
        files.push(new FormControl({ value: undefined, disabled: false }, Validators.required));
    }

    public openFileDialog(index: number) {
        $(this.fileInputs.toArray()[index].nativeElement).click();
    }

    public onFileSelected(event: Event, control: AbstractControl, index: number) {
        const filePath = (<any>event.target).value;
        const file = (<any>event.target).files[0];
        control.patchValue({ filePathName: filePath, fileObj: file });
    }

    public onResetClick() {
        this.submitted = false;
        this.form.reset();
        // Reset the file input so that the same file could be selected again
        const elements = this.fileInputs.toArray();
        elements.forEach(element => {
            element.nativeElement.value = '';
        });
    }

    public onGetTransactions() {
        if (this.form.valid) {
            const files = <FormArray>this.form.controls['files'];
            const selectedFiles: any[] = [];
            for (let i = 0; i < files.controls.length; i++) {
                const control = files.controls[i];
                if (control.value) {
                    selectedFiles.push(control.value.fileObj);
                }
            }

            if (selectedFiles && selectedFiles.length > 0) {
                // open the dialog and display the provided component
                const compRef = this.modalService.open(TransactionViewerComponent, { windowClass: 'transaction-viewer' });
                const compInstance = <TransactionViewerComponent>compRef.componentInstance;
                compInstance.files = selectedFiles;
            }
        }
    }
}

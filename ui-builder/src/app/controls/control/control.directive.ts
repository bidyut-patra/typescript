import { Directive, ViewContainerRef, OnInit, ComponentFactoryResolver, Input,
         Type, OnChanges, SimpleChanges, ComponentRef, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContentControl, Control } from 'src/app/models/control';
import { TextboxComponent } from '../text-box/textbox.component';
import { ComboboxComponent } from '../combo-box/combobox.component';
import { CheckboxComponent } from '../check-box/checkbox.component';
import { RadioComponent } from '../radio-button/radio.component';
import { ControlComponent } from './control.component';
import { ControlRegistry } from './control.registry';
import { GroupBoxComponent } from '../group-box/groupbox.component';

@Directive({
    selector: '[appControl]'
})
export class ControlDirective implements OnInit, OnChanges, OnDestroy {
    @Input() appControl: Control;
    @Input() appControlFormGroup: FormGroup;
    @Input() appControlMetadata: any;

    constructor(private controlRegistry: ControlRegistry,
                private viewContainerRef: ViewContainerRef,
                private componentFactoryResolver: ComponentFactoryResolver) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.appControl.currentValue &&
            changes.appControlFormGroup.currentValue &&
            changes.appControlMetadata.currentValue) {
            this.loadComponent();
        }
    }

    ngOnInit() {
        this.loadComponent();
    }

    private loadComponent() {
        if (this.appControlMetadata && this.appControlMetadata[this.appControl.type]) {
            if (this.controlRegistry.contains(this.appControl.id) === false) {
                this.controlRegistry.register(this.appControl.id);
                this.createComponent(this.appControl.type);
            }
        }
    }

    private createComponent(controlType: string) {
        let component: Type<{}>;
        switch (controlType) {
            case 'text':
                component = TextboxComponent;
                break;
            case 'combo':
                component = ComboboxComponent;
                break;
            case 'check':
                component = CheckboxComponent;
                break;
            case 'radio':
                component = RadioComponent;
                break;
            case 'section':
                component = GroupBoxComponent;
                break;
            default:
                component = TextboxComponent;
                break;
        }
        this.attachComponent(component);
    }

    /**
     * Attaches the component to DOM
     * @param component
     */
    private attachComponent(component: Type<{}>) {
        if (component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
            const componentRef: ComponentRef<{}> = this.viewContainerRef.createComponent(componentFactory);
            if (componentRef) {
                const componentInstance = componentRef.instance;
                const controlInstance = <ControlComponent>componentInstance;
                controlInstance.control = this.appControl;
                controlInstance.formGroup = this.getFormGroup();
                controlInstance.metadata = this.appControlMetadata;
            }
        }
    }

    private getFormGroup(): FormGroup {
        if (this.appControl.type === 'section') {
            return (<ContentControl>this.appControl).getFormControl() as FormGroup;
        } else {
           return this.appControlFormGroup;
        }
    }

    private getComponent(controlTypeObj: any): Promise<Type<{}>> {
        const component = controlTypeObj.component;
        return import('.' + component);
    }

    ngOnDestroy() {
        this.controlRegistry.unregister(this.appControl.id);
    }
}

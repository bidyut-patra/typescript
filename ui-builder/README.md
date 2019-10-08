# UiBuilder

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.5.

In the beginning, this projects aimed to provide a platform to generate Web UI from the back end JSON model which provides the metadata information related to UI controls and vice versa i.e. generate JSON model from UI controls. Currently I am trying to develop UI from sample JSON model. Eventually user should be able to build a complete page from a list of controls by dragging & dropping them on the work space and this will generate the JSON model on the fly. And then from this JSON model we should be able to generate the actual page. But this is currently on hold.

At the moment, a graphics editor is on development which has pallet of graphical elements which can be dragged & dropped on the graphical area on the right hand side. User will be interconnect these graphics objects to draw a flowchart. Idea is to create any custom graphical element with minimal development effort and use them. Next goal is to save the whole graphics & reload them from a file. Right now the data is read from a backend json file.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

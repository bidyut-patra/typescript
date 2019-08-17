import { ErrorHandler, Injectable, Inject } from '@angular/core';
import { ApplicationLogger } from './logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(@Inject('Logger') private logger: ApplicationLogger) {

    }

    handleError(error) {

    }
}

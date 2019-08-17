import { Injectable } from '@angular/core';
import { getLogger, Logger } from 'log4javascript';

@Injectable()
export class ApplicationLogger {
    private logger: Logger;

    constructor() {
        this.logger = getLogger();
    }

    public info(message: any) {
        this.logger.info(message);
    }

    public error(message: any) {
        this.logger.error(message);
    }

    public warn(message: any) {
        this.logger.warn(message);
    }

    public trace(message: any) {
        this.logger.trace(message);
    }
}

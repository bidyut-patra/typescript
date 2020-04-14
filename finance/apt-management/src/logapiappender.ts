import { AjaxAppender } from 'log4javascript';

export class LogApiAppender extends AjaxAppender {
    private logger: any;

    constructor(logger: any) {
        super(logger.api, false);
        this.logger = logger;

        this.initialize();
    }

    /**
     * Initializes the logger based on the configuration
     */
    private initialize() {
        if (this.logger !== undefined) {
            const batchSize = this.logger.batch ? this.logger.batch : 10;
            this.setBatchSize(batchSize);
            this.setTimed(true);
            this.setWaitForResponse(true);
            const interval = this.logger.interval ? this.logger.interval : 5000;
            this.setTimerInterval(interval);
            this.setSendAllOnUnload(true);
            this.setSessionId('');
            this.addHeader('', '');
        }
    }
}

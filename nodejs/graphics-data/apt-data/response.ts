export class Response {
    public data: any;
    public error: any;
    public success: boolean;
    
    constructor(data: any, error?: any) {
        this.data = data;
        if (error) {
            this.error = error;
            this.success = false;
        } else {
            this.success = true;
        }
    }
}
import * as fs from 'fs';

export class AppSettings {
    private static settings: any;

    public static initialize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var fileName: any = './/appsettings.json';
            fs.readFile(fileName, 'utf8', function(err: any, data: any) {
                if (err) throw err;
                AppSettings.settings = JSON.parse(data);
                resolve();            
            });
        });
    }

    public static get DbConnectionString(): string {
        return AppSettings.settings.db.connectionString;
    }


    public static get Origins(): string[] {
        return AppSettings.settings.origins;
    }

    public static get PopulateData() {
        return AppSettings.settings.populateData;
    }

    public static get InputTransactionFile() {
        return AppSettings.settings.output.outputDir + '/' + AppSettings.settings.output.transactionSheet;
    }

    public static get InputPaymentFile() {
        return AppSettings.settings.output.outputDir + '/' + AppSettings.settings.output.paymentSheet;
    }

    public static get OutputTransactionFile() {
        const fileNameWithoutExtn = AppSettings.getFileNameWithoutExtn(AppSettings.settings.output.transactionSheet);
        const fileExtn = AppSettings.getFileExtn(AppSettings.settings.output.transactionSheet);
        const outputTransactionFileName = fileNameWithoutExtn + AppSettings.getDayMonth() + "." + fileExtn;
        return AppSettings.settings.output.outputDir + '/' + outputTransactionFileName;
    }

    public static get OutputPaymentFile() {
        const fileNameWithoutExtn = AppSettings.getFileNameWithoutExtn(AppSettings.settings.output.paymentSheet);
        const fileExtn = AppSettings.getFileExtn(AppSettings.settings.output.paymentSheet);
        const outputPaymentFileName = fileNameWithoutExtn + AppSettings.getDayMonth() + "." + fileExtn;
        return AppSettings.settings.output.outputDir + '/' + outputPaymentFileName;
    }

    private static getFileExtn(fileName: string): string {
        var fileExtn: string;
        const index = fileName ? fileName.lastIndexOf(".") : -1;
        fileExtn = index >= 0 ? fileName.substring(index + 1) : fileName;
        return fileExtn;
    }

    private static getFileNameWithoutExtn(fileName: string): string {
        var fileNameWithoutExtn: string;
        const index = fileName ? fileName.lastIndexOf(".") : -1;
        fileNameWithoutExtn = index >= 0 ? fileName.substring(0, index) : fileName;
        return fileNameWithoutExtn;
    }

    private static getDayMonth(): string {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth();
        return "_" + day + "_" + AppSettings.getMonth(month);
    }

    private static getMonth(month: number): string {
        var monthArr = new Array();
        monthArr[0] = "JAN";
        monthArr[1] = "FEB";
        monthArr[2] = "MAR";
        monthArr[3] = "APR";
        monthArr[4] = "MAY";
        monthArr[5] = "JUN";
        monthArr[6] = "JUL";
        monthArr[7] = "AUG";
        monthArr[8] = "SEP";
        monthArr[9] = "OCT";
        monthArr[10] = "NOV";
        monthArr[11] = "DEC";
        return monthArr[month];
    }
}
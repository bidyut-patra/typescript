import { Workbook, Worksheet, Row } from 'exceljs';
import df from 'dateformat';
import { Utility } from '../lib/utility';

export class Excel {
    /**
     * Reads the excel data
     * 
     * @param transactionFile 
     * @param configurations 
     */
    public async readFile(transactionFile: string, configurations: any[]) {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(transactionFile);        
        const dataSheets: any = {};
        for (let i = 0; i < configurations.length; i++) {
            const configuration = configurations[i];
            const sheet = workbook.getWorksheet(configuration.sheetName);
            const data: any[] = [];
            if (sheet) {
                let row = configuration.row;
                let cells = <any[]>configuration.cells;
                let excelRow = sheet.getRow(row);

                while(this.isValidRow(cells, excelRow)) {
                    const rowData: any = {};
                    for (let i = 0; i < cells.length; i++) {
                        const cell = cells[i];
                        const cellValue: any = excelRow.getCell(cell.label).value;
                        const formattedValue = this.getFormattedData(cellValue, cell.type, cell.array, cell.separator);
                        if (rowData[cell.column]) {
                            rowData[cell.column] += formattedValue ? formattedValue : 0;
                        } else {
                            rowData[cell.column] = formattedValue;
                        }
                    }
                    data.push(rowData);
                    excelRow = sheet.getRow(++row);
                }                
            }
            dataSheets[configuration.sheetName] = data;
        }
        return dataSheets;
    }

    /**
     * Update the excel sheets
     * 
     * @param sourceFile 
     * @param targetFile 
     * @param configurations 
     * @param transactions 
     */
    public async updateFile(sourceFile: string, targetFile: string, configurations: any[], transactions: any) {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(sourceFile);
        let aptCounter = 0;
    
        for (let i = 0; i < configurations.length; i++) {
            const configuration = configurations[i];
            const sheet = workbook.getWorksheet(configuration.sheetName);
            const sheetTransactions = <any[]>transactions[configuration.sheetName];
    
            if (sheet && sheetTransactions && (sheetTransactions.length > 0)) {
                let row = configuration.row;
                let cells = <any[]>configuration.cells;
                let excelRow = sheet.getRow(row);

                while(this.isValidRow(cells, excelRow)) { excelRow = sheet.getRow(++row); };
                
                for (let j = 0; j < sheetTransactions.length; j++) {
                    const transaction = sheetTransactions[j];
                    cells.forEach(cell => {
                        if (cell.update) {
                            excelRow.getCell(cell.label).alignment = cell.alignment;
                            if (cell.type === 'date') {
                                const dateValue = transaction[cell.column];
                                const dateString = df(dateValue, cell.valueFormat);
                                const formattedDate = df(dateValue, cell.cellFormat);                        
                                excelRow.getCell(cell.label).value = dateString;
                            } else {
                                if (transaction[cell.column]) {
                                    excelRow.getCell(cell.label).value = transaction[cell.column];
                                }
                            }
                        }
                    });
                    excelRow = sheet.getRow(++row);
                }
    
                aptCounter++;
            }
        }
    
        await workbook.xlsx.writeFile(targetFile);
    }

    /**
     * Gets the formatted data
     * 
     * @param cellValue 
     * @param type 
     */
    private getFormattedData(cellValue: any, type: string, array: boolean, separator: string) {
        if ((cellValue === null) || (cellValue === undefined)) {
            return undefined;
        } else {            
            let arrayValues: any[] = [];
            if (array && separator) {
                arrayValues = this.splitText(cellValue.toString(), separator);
            }

            let formattedValue = undefined;            
            switch(type) {
                case 'date':
                    formattedValue = df(new Date(cellValue), 'dd-mmm-yyyy');
                    break;
                case 'number':
                    formattedValue = arrayValues.length === 0 ? Utility.getNumber(cellValue) : arrayValues.map(a => Utility.getNumber(cellValue));
                    break;
                case 'string':
                    formattedValue = cellValue.toString();
                    break;
                default:
                    formattedValue = cellValue;
                    break;
            }
            return formattedValue;
        }
    }
    
    /**
     * Checks if this is a row with valid data or an empty row
     * 
     * @param cells 
     * @param excelRow 
     */
    private isValidRow(cells: any[], excelRow: Row) {
        let _hasValidDataAtLeastInOneCell = false;
        for(let i = 0; (i < cells.length) && !_hasValidDataAtLeastInOneCell; i++) {
            if (excelRow.getCell(cells[i].label).value) {
                _hasValidDataAtLeastInOneCell = true;
            }
        }
        return _hasValidDataAtLeastInOneCell;
    }    

    /**
     * Splits the text based on given separator
     * 
     * @param message 
     * @param pattern 
     */
    private splitText(message: string, pattern: string): string[] {
        if (message) {
            const regex = new RegExp(pattern, 'g');
            const splitStrings: string[] = message.split(regex);
            return splitStrings;
        } else {
            return [];
        }
    }

    private trimChars(message: string, leadingChars: string[], traillingChars: string[]) {
        const messageAfterLeadingCharsRemoval = this.trimLeadingChars(message, leadingChars);
        return this.trimTraillingChars(messageAfterLeadingCharsRemoval, traillingChars);
    }

    private trimTraillingChars(message: string, characters: string[]) {
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    }

    private trimLeadingChars(message: string, characters: string[]) {
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            while (message.endsWith(character)) {
                message = message.substring(0, message.length - 2);
            }
        }
        return message;
    }
}
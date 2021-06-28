export class Utility {
    public static trimSpaces(text: string) {
        if(text) {
            return text.replace(/\s/g, '');
        } else {
            return text;
        }
    }

    public static trimChars(text: string, characters: string[]) {
        if(text) {
            for(let i = 0; i < characters.length; i++) {
                const character = characters[i];
                text = text.replace(new RegExp(character, 'g'), '');
            }
        }
        return text;
    }

    public static trimLeadingSpaces(text: string) {
        return text.replace(/^\s*(.*)/, "$1");
    }

    public static trimTrailingSpaces(text: string) {
        return text.replace(/(.*)\s*$/, "$1");
    }

    public static getNumber(val: string): number {
        if (val) {
            if (val === '-') {
                return 0;
            } else if (val === '') {
                return 0;
            } else {
                let strVal: string = '\'' + val + '\'';
                strVal = strVal.replace(/,/g, '');
                strVal = strVal.replace('\'', '');
                strVal = strVal.replace('\'', '');
                strVal = strVal.replace('"', '');
                strVal = strVal.replace('"', '');
                strVal = strVal.replace('(', '');
                strVal = strVal.replace(')', '');
                return parseFloat(strVal);
            }
        } else {
            return 0;
        }
    }
}
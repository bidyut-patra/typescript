import queryString = require('querystring');

export function getQueryData(url: string): any {
    const qStr = url.substr(url.indexOf('?') + 1);
    const queryObj = queryString.parse(qStr);
    return queryObj;
}
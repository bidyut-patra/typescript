import { useLocation } from 'react-router-dom';
let queryString = require('query-string');

export function GetQueryObject() {
    // fetch routed location
    const location = useLocation();    
    // parse the query string in the URL
    const queryObj = queryString.parse(location.search);
    return queryObj;
}
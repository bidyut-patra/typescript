import React from 'react';
import { useLocation } from 'react-router-dom';
import { ConfirmSave } from './confirmSave';
let queryString = require('query-string');

export function SaveButton(props) {
    const [modalShow, setModalShow] = React.useState(false);
    // fetch routed location
    const location = useLocation();    
    // parse the query string in the URL
    const queryObj = queryString.parse(location.search);
    let modalDlg = <ConfirmSave show={modalShow} user={queryObj.user} details={props.details} onHide={() => setModalShow(false)}></ConfirmSave>;
    let saveBtn = <button className="btn btn-primary btn-save" type="submit" onClick={() => setModalShow(true)}>Save</button>;
    return (
        <div>
            {saveBtn}
            {modalDlg}
        </div>
    )
}
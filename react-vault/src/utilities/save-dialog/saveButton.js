import React from 'react';
import { GetQueryObject } from '../others/location';
import { ConfirmSave } from './confirmSave';

export function SaveButton(props) {
    const [modalShow, setModalShow] = React.useState(false);
    const queryObj = GetQueryObject();
    let modalDlg = <ConfirmSave show={modalShow} user={queryObj.user}
    onFetchPostDetails={() => props.onFetchPostDetails(props.data)} 
    onFetchContent={() => props.onFetchContent(props.data)} 
    onHide={() => setModalShow(false)}></ConfirmSave>;
    let saveBtn = <button className="btn btn-primary btn-save" type="submit" onClick={() => setModalShow(true)}>{props.btnLabel}</button>;
    return (
        <div>
            {saveBtn}
            {modalDlg}
        </div>
    )
}
import React from 'react';
import { ConfirmSave } from './confirmSave';

export function SaveButton(props) {
    const [modalShow, setModalShow] = React.useState(false);
    let modalDlg = <ConfirmSave show={modalShow} details={props.details} onHide={() => setModalShow(false)}></ConfirmSave>;
    let saveBtn = <button className="btn btn-primary btn-save" type="submit" onClick={() => setModalShow(true)}>Save</button>;
    return (
        <div>
            {saveBtn}
            {modalDlg}
        </div>
    )
}
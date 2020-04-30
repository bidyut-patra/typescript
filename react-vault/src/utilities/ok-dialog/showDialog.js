import React from 'react';
import { OkDialog } from './okDialog';

export function ShowOkDialog(props) {
    const [modalShow, setModalShow] = React.useState(false);
    let modalDlg = <OkDialog show={modalShow} message={props.message} 
    messageType={props.messageType} onHide={() => setModalShow(false)}></OkDialog>;

    return (
        {modalDlg}
    )
}
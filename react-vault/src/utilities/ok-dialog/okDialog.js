import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export class OkDialog extends Component {
    constructor() {
        super();

        this.state = {}
        this.onOk = this.onOk.bind(this);
    }

    onOk = () => {
        this.props.onHide();
    }

    render() {
        const { message, messageType, ...rest } = this.props;
        let body, title;

        if (messageType === 0) { // Progress
            title = 'Progress';
            body = <div><i className="fa fa-spin"></i>Save is in progress...</div>;
        } else if (messageType === 1) { // success        
            title = 'Success';
            body = <div>Success: {message}</div>
        } else if (messageType === 2) { // Failure
            title = 'Error';
            body = <div>Error: {message}</div>
        } else {

        }

        return (
            <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onOk}>OK</Button>
                </Modal.Footer>
            </Modal>
        )
    }    
}


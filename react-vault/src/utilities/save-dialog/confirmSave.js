import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export class ConfirmSave extends Component {
    constructor() {
        super();

        this.state = {}

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = () => {
        let postData = this.props.onFetchPostDetails();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData.json)
        };
        let url = this.postData.url + '?user=' + this.props.user;
        fetch(url, requestOptions)
            .then(response => response.json())
            .catch(error => {
                console.log(error);
            })
        this.props.onHide();
    }

    render() {
        const { onFetchContent, onFetchPostDetails, ...rest } = this.props;
        let body = onFetchContent();

        return (
            <Modal {...rest} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Confirmation Dialog
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.onSubmit}>Confirm</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }    
}


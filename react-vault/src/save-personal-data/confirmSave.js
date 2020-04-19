import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export class ConfirmSave extends Component {
    constructor() {
        super();

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit = () => {
        let details = this.props.details;
        let owners = [];
        for (let i = 0; i < details.length; i++) {
            let row = details[i];
            if (row.selectedType === 'resident') {
                owners.push(row.userData);
            }
        }

        if (owners.length > 0) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ owners: owners })
            };
            fetch(this.state.url + '/data/api/owners', requestOptions)
                .then(response => response.json())
                .catch(error => {
                    console.log(error);
                })
        }

        this.props.onHide();
    }

    render() {
        let details = this.props.details;
        let body = [];
        if (details && details.length) {
            for (let i = 0; i < details.length; i++) {
                let detail = details[i];
                let detailDiv = <div key={i}><h3>{detail.selectedType}</h3><p>{detail.userData.aptNumber}</p></div>;
                body.push(detailDiv);
            }
        } else {
            body.push(<p>There is no data to save. Please enter data.</p>);
        }

        return (
            <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
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

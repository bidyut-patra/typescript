import React, { Component } from 'react';
import './savePersonalData.css'
import { PersonalDetails } from '../personal-details/personalDetails';

export class SavePersonalData extends Component {
    constructor() {
        super();

        this.state = {
            rows: [],
            types: [
                { id: 'resident', text: 'Resident Details' },
                { id: 'bank', text: 'Bank Details' },
                { id: 'mail', text: 'Mail Account' },
                { id: 'system', text: 'System Account' },
                { id: 'mobile', text: 'Mobile Phone' }
            ],
            url: ''
        };

        // This binding is required to access member variables and in-built 'state' member
        this.onSubmit = this.onSubmit.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onEnterUrl = this.onEnterUrl.bind(this);
    }

    onSubmit = () => {
        console.log('state:', this.state);
        let owners = [];
        for (let i = 0; i < this.state.rows.length; i++) {
            let row = this.state.rows[i];
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
    }

    onEnterUrl = (url) => {
        this.setState({
            url: url
        })
    }

    onAdd = () => {
        let eRows = this.state.rows;
        eRows.push({
            id: 'row_' + eRows.length,
            selectedType: 'resident',
            userData: {}
        });
        this.setState({
            rows: eRows
        });
    }

    onRemove = (rowId) => {
        let eRows = this.state.rows;
        let rowIndex = eRows.findIndex(r => r.id === rowId);
        if (rowIndex >= 0) {
            eRows.splice(rowIndex, 1);
            this.setState({
                rows: eRows
            });
        }
    }

    onTypeChange = (type, rowId) => {
        let eRows = this.state.rows;
        let rowIndex = eRows.findIndex(r => r.id === rowId);
        if (rowIndex >= 0) {
            eRows[rowIndex].selectedType = type;
            eRows[rowIndex].userData = {};
            this.setState({
                rows: eRows
            });
        }
    }

    render() {
        let listOfPersonalDetails = [];
        let saveBtn;

        if (this.state.rows.length > 0) {
            for (let rIndex = 0; rIndex < this.state.rows.length; rIndex++) {
                let row = this.state.rows[rIndex];
                let rowId = row.id;
                let removeBtn = <button className="btn btn-secondary" onClick={() => this.onRemove(rowId)}>X</button>;
                let typeOptions = [];
                for (let tIndex = 0; tIndex < this.state.types.length; tIndex++) {
                    let type = this.state.types[tIndex];
                    typeOptions.push(<option key={tIndex} value={type.id}>{type.text}</option>);
                }
                let typeSelect = <select className="form-control custom-font" onChange={e => this.onTypeChange(e.target.value, rowId)}>{typeOptions}</select>;
                let typeLabel = <label>Select Type</label>;
                let typeSelection = <div>{typeLabel}{typeSelect}</div>;
                let personalHeader = <div className="personal-data-header">{removeBtn}{typeSelection}</div>;
                let personalDetails = <PersonalDetails type={row.selectedType} data={row.userData}></PersonalDetails>;
                let personalContent = <div className="personal-details">{personalDetails}</div>;
                listOfPersonalDetails.push(<div key={rIndex}>{personalHeader}{personalContent}</div>);
            }

            listOfPersonalDetails = <div className="list-of-personal-details">{listOfPersonalDetails}</div>;
            saveBtn = <button className="btn btn-primary btn-save" type="submit" onClick={this.onSubmit}>Save</button>;
            let saveUrl = <input className="form-control url-input" type="text" onKeyUp={e => this.onEnterUrl(e.target.value)}/>
            saveBtn = <div className="fixed-bottom save-section">{saveBtn}{saveUrl}</div> 
        }

        let addBtn = <button className="btn btn-primary btn-add" onClick={this.onAdd}>Add</button>;

        return (
            <div>
                {addBtn}
                {listOfPersonalDetails}
                {saveBtn}
            </div>
        )
    }
}
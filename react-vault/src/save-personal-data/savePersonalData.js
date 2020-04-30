import React, { Component } from 'react';
import { PersonalDetails } from '../personal-details/personalDetails';
import './savePersonalData.css'
import { SaveButton } from '../utilities/save-dialog/saveButton';

export class SavePersonalData extends Component {
    constructor() {
        super();

        this.state = {
            rows: [
                {
                    id: 'row_0',
                    selectedType: 'resident',
                    userData: {}
                }
            ],
            types: [
                { id: 'resident', text: 'Resident Details' },
                { id: 'electricity', text: 'Electric Bill Payment' },
                { id: 'bank', text: 'Bank Details' },
                { id: 'mail', text: 'Mail Account' },
                { id: 'system', text: 'System Account' },
                { id: 'mobile', text: 'Mobile Phone' },
                { id: 'podar', text: 'Podar App Data' },
                { id: 'hpcylinder', text: 'HP Cylinder Booking' }
            ]
        };

        // This binding is required to access member variables and in-built 'state' member
        this.onAdd = this.onAdd.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
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
                let typeLabel = <label className="type-label">Select Type</label>;
                let typeSelection = <div className="type-selection">{typeLabel}{typeSelect}</div>;
                let personalHeader = <div className="personal-data-header">{removeBtn}{typeSelection}</div>;
                let personalDetails = <PersonalDetails type={row.selectedType} data={row.userData}></PersonalDetails>;
                let personalContent = <div className="personal-details">{personalDetails}</div>;
                listOfPersonalDetails.push(<div key={rIndex}>{personalHeader}{personalContent}</div>);
            }

            let owners = [];
            for (let i = 0; i < this.state.rows.length; i++) {
                let row = this.state.rows[i];
                if (row.selectedType === 'resident') {
                    owners.push(row.userData);
                }
            }

            listOfPersonalDetails = <div className="list-of-personal-details">{listOfPersonalDetails}</div>;
            saveBtn = <SaveButton btnLabel='Save'
                        onFetchContent={(content) => this.getConfirmSaveContent(content)} 
                        onFetchPostDetails={(content) => this.getPostDataDetails(content)} 
                        data={owners}>                                    
                      </SaveButton>;            
            saveBtn = <div className="fixed-bottom save-section">{saveBtn}</div> 
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

    getPostDataDetails = (owners, binding) => {
        let postData = {
            json: { owners: owners },
            url: 'http://localhost:3000/data/api/owners',
            error: '',            
        };
        return postData;
    }

    getConfirmSaveContent = (owners) => {
        let body = [];
        if (owners && (owners.length > 0)) {
            for (let i = 0; i < owners.length; i++) {
                let owner = owners[i];
                if ((owner.number === undefined) && (owners.length === 1)) {
                    body.push(<p key={i}>There is no data entered to save.</p>);
                } else {
                    let ownerDiv = <div key={i}><h3>{owner.name}</h3><p>{owner.number}</p></div>;
                    body.push(ownerDiv);
                }
            }
        } else {
            body.push(<p key='0'>There is no data to save.</p>);
        }
        return [body, {}];
    }
}

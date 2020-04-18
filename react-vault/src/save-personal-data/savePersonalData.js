import React, { Component } from 'react';
import './savePersonalData.css'
import { PersonalDetails } from '../personal-details/personalDetails';

export class SavePersonalData extends Component {
    constructor() {
        super();

        this.state = {
            rows: []
        };

        // This binding is required to access member variables and in-built 'state' member
        this.onSubmit = this.onSubmit.bind(this);
        this.onAdd = this.onAdd.bind(this);
    }

    onSubmit = () => {

    }

    onAdd = () => {
        let eRows = this.state.rows;
        eRows.push({
            id: 'row_' + eRows.length
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

    render() {
        let personalDetails = [];
        let saveBtn;

        if (this.state.rows.length > 0) {
            for (let rIndex = 0; rIndex < this.state.rows.length; rIndex++) {
                let rowId = this.state.rows[rIndex].id;
                let removeBtn = <button className="btn btn-secondary" onClick={() => this.onRemove(rowId)}>X</button>;
                let personalHeader = <div className="personal-data-header">{removeBtn}</div>;
                let personalContent = <div className="personal-details"><PersonalDetails></PersonalDetails></div>;
                personalDetails.push(<div key={rIndex}>{personalHeader}{personalContent}</div>);
            }

            personalDetails = <div className="list-of-personal-details">{personalDetails}</div>;
            saveBtn = <button className="fixed-bottom btn btn-primary btn-save" type="submit" onClick={this.onSubmit}>Save</button>;
        }

        let addBtn = <button className="btn btn-primary btn-add" onClick={this.onAdd}>Add</button>;

        return (
            <div>
                {addBtn}
                {personalDetails}
                {saveBtn}
            </div>
        )
    }
}
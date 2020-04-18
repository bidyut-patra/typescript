import React, { Component } from 'react';
import './personalDetails.css';

export class PersonalDetails extends Component {
    render() {
        let style = {
            marginRight: 0,
            padding: 20
        }

        return (
            <div className="row personal-details-content" style={style}>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <label htmlFor="action">Apt Number*</label>
                    <select className="form-control custom-font">
                        <option></option>
                        <option>
                            TEXT
                        </option>
                    </select>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <label htmlFor="owner">Owner's Name</label>
                    <input className="form-control custom-font" readOnly id="owner"/>
                </div>          
            </div>
        )
    }
}
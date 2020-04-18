import React, { Component } from 'react';

export class BankDetails extends Component {
    constructor() {
        super();

        this.state = {

        };
    }

    render() {
        let style = {
            marginRight: 0,
            padding: 20
        }

        return (
            <div className="personal-details-content">
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Bank Name</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Account Type</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>          
                </div>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Account Number</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Account Name</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>          
                </div>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Debit Card</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Card PIN</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>          
                </div>                
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Internet User</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Internet Password</label>
                        <input className="form-control custom-font" autoComplete="off"/>
                    </div>          
                </div>                
            </div>            
        )
    }
}
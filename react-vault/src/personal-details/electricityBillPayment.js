import React, { Component } from 'react';

export class ElectricityBillPayment extends Component {
    constructor() {
        super();
        
        this.onEnterUser = this.onEnterUser.bind(this);
        this.onEnterPassword = this.onEnterPassword.bind(this);
        this.onEnterConsumerNumber = this.onEnterConsumerNumber.bind(this);
        this.onEnterMeterNumber = this.onEnterMeterNumber.bind(this);
    }

    onEnterUser = (user) => {
        // this.setState({
        //     user: user
        // });
        this.data.user = user;
    }

    onEnterPassword = (password) => {
        // this.setState({
        //     password: password
        // });
        this.data.password = password;
    }

    onEnterConsumerNumber = (consumerNumber) => {
        // this.setState({
        //     consumerNumber: consumerNumber
        // });
        this.data.consumerNumber = consumerNumber;
    }

    onEnterMeterNumber = (meterNumber) => {
        // this.setState({
        //     meterNumber: meterNumber
        // });
        this.data.meterNumber = meterNumber;
    }

    render() {
        let style = {
            marginRight: 0,
            padding: 20
        }

        this.data = this.props.data;

        return (
            <div className="personal-details-content">
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>User *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterUser(e.target.value)} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Password *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterPassword(e.target.value)} autoComplete="off"/>
                    </div>          
                </div>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Consumer Number *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterConsumerNumber(e.target.value)} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Meter Number *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterMeterNumber(e.target.value)} autoComplete="off"/>
                    </div>          
                </div>                
            </div>            
        )        
    }
}
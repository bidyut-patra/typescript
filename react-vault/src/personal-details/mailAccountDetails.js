import React, { Component } from 'react';

export class MailAccountDetails extends Component {
    constructor() {
        super();

        this.onEnterEmail = this.onEnterEmail.bind(this);
        this.onEnterPassword = this.onEnterPassword.bind(this);
    }

    onEnterEmail = (email) => {
        // this.setState({
        //     email: email
        // });
        this.data.email = email;
    }

    onEnterPassword = (password) => {
        // this.setState({
        //     password: password
        // });
        this.data.password = password;
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
                        <label htmlFor="action">Email</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterEmail(e.target.value)} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Password</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterPassword(e.target.value)} autoComplete="off"/>
                    </div>          
                </div>
            </div>            
        )        
    }
}
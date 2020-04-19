import React, { Component } from 'react';

export class PodarAppData extends Component {
    constructor() {
        super();
        
        this.onEnterUser = this.onEnterUser.bind(this);
        this.onEnterPassword = this.onEnterPassword.bind(this);
    }

    onEnterUser = (user, key) => {
        // this.setState({
        //     user: user
        // });
        if (this.data.key === undefined) {
            this.data.key = {};
        }
        this.data.user = user;
    }

    onEnterPassword = (password, key) => {
        // this.setState({
        //     password: password
        // });
        if (this.data.key === undefined) {
            this.data.key = {};
        }        
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
                        <label>Between-Us User *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterUser(e.target.value, 'betweenUs')} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Between-Us Password *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterPassword(e.target.value, 'betweenUs')} autoComplete="off"/>
                    </div>          
                </div>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Shop-For-School User *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterUser(e.target.value, 'shopForSchool')} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Shop-For-School Password *</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterPassword(e.target.value, 'shopForSchool')} autoComplete="off"/>
                    </div>          
                </div>                
            </div>            
        )        
    }
}
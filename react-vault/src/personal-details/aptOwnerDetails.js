import React, { Component } from 'react';

export class AptOwnerDetails extends Component {
    constructor() {
        super();

        this.state = {
            aptNumber: '',
            owner: '',
            email: '',
            contact: ''
        }

        this.onEnterAptNumber = this.onEnterAptNumber.bind(this);
        this.onEnterContact = this.onEnterContact.bind(this);
        this.onEnterEmail = this.onEnterEmail.bind(this);
        this.onEnterOwner = this.onEnterOwner.bind(this);
    }

    componentDidMount() {
        
    }

    onEnterAptNumber = (aptNumber) => {
        // this.setState({
        //     aptNumber: aptNumber
        // });
        this.data.number = aptNumber;
    }

    onEnterOwner = (owner) => {
        // this.setState({
        //     owner: owner
        // });
        this.data.name = owner;
    }

    onEnterEmail = (email) => {
        // this.setState({
        //     email: email
        // });
        this.data.email = email;
    }

    onEnterContact = (contact) => {
        // this.setState({
        //     contact: contact
        // });
        this.data.contact = contact;
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
                        <label htmlFor="action">Apt Number*</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterAptNumber(e.target.value)} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Owner's Name</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterOwner(e.target.value)} autoComplete="off"/>
                    </div>          
                </div>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Email</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterEmail(e.target.value)} autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Contact</label>
                        <input className="form-control custom-font" onKeyUp={e => this.onEnterContact(e.target.value)} autoComplete="off"/>
                    </div>          
                </div>
            </div>            
        )
    }
}
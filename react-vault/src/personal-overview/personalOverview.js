import React, { Component } from 'react';
import { SavePersonalData } from '../save-personal-data/savePersonalData';
import { ViewPersonalData } from '../view-personal-data/viewPersonalData';
import './personalOverview.css';

export class PersonalOverview extends Component {
    constructor() {
        super();

        this.paymentLinks = [
            {
                id: 'savePersonalDetails',
                label: 'Save Personal Details'
            },
            {
                id: 'viewPersonalDetails',
                label: 'View Personal Details'
            }
        ];

        this.state = { 
            activeLinkId: 'savePersonalDetails' 
        };

        // This binding is required to access member variables and in-built 'state' member
        this.onLinkClick = this.onLinkClick.bind(this);
    }

    onLinkClick = (linkId) => {
        this.setState({
            activeLinkId: linkId
        })
    }

    render() {
        let activeLinkId  = this.state.activeLinkId;
        let view;
        if (activeLinkId === 'savePersonalDetails') {
            view = <SavePersonalData></SavePersonalData>;          
        } else {
            view = <ViewPersonalData></ViewPersonalData>;
        }

        return (
            <div>
                <ul className="nav nav-tabs">
                    {
                        this.paymentLinks.map((paymentLink, i) => {
                            const linkActiveClass = this.state.activeLinkId === paymentLink.id ? 'credit-nav-active' : 'credit-nav-inactive';
                            return (
                                <li key={i} className={`nav-item credit-nav-item ${linkActiveClass}`}>
                                    <div className="nav-link" onClick={ () => this.onLinkClick(paymentLink.id) }>
                                        {paymentLink.label}
                                    </div>
                                </li>
                            )
                        })
                    }                    
                </ul>
                <div className="content">
                    {view}
                </div>
            </div>
        )
    }
}

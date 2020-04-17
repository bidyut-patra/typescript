import React, { Component } from 'react';
import { DisplayActiveLink } from './displayActiveLink';
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
        this.activeLinkId = 'savePersonalDetails';
    }

    render() {
        return (
            <div>
                <ul className="nav nav-tabs">
                    {
                        this.paymentLinks.map((paymentLink, i) => {
                            if (this.activeLinkId === paymentLink.id) {
                                return (
                                    <li key={i} className="nav-item credit-nav-item credit-nav-active">{paymentLink.label}</li>
                                )
                            } else {
                                return (
                                    <li key={i} className="nav-item credit-nav-item credit-nav-inactive">{paymentLink.label}</li>
                                )
                            }
                        })
                    }                    
                </ul>
                <div className="content">
                    <DisplayActiveLink activeLinkId={this.activeLinkId}></DisplayActiveLink>
                </div>
            </div>
        )
    }
}

import React, { Component } from 'react';
import './applyMaintenance.css';
import { SaveMaintenanceDetails } from '../save-maintenance-details/saveMaintenanceDetails';
import { ViewMaintenanceDetails } from '../view-maintenance-details/viewMaintenanceDetails';

export class ApplyMaintenance extends Component {
    constructor() {
        super();

        this.paymentLinks = [
            {
                id: 'applyMaintenanceDetails',
                label: 'Apply Maintenance Details'
            },
            {
                id: 'viewMaintenanceChanges',
                label: 'View Maintenance Changes'
            }
        ];

        this.state = { 
            activeLinkId: 'applyMaintenanceDetails' 
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
        if (activeLinkId === 'applyMaintenanceDetails') {
            view = <SaveMaintenanceDetails></SaveMaintenanceDetails>;          
        } else {
            view = <ViewMaintenanceDetails></ViewMaintenanceDetails>;
        }

        return (
            <div>
                <ul className="nav nav-tabs">
                    {
                        this.paymentLinks.map((paymentLink, i) => {
                            const linkActiveClass = this.state.activeLinkId === paymentLink.id ? 'main-nav-active' : 'main-nav-inactive';
                            return (
                                <li key={i} className={`nav-item main-nav-item ${linkActiveClass}`}>
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

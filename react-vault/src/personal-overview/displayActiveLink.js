import React, { Component } from 'react';
import { SavePersonalData } from '../save-personal-data/savePersonalData';
import { ViewPersonalData } from '../view-personal-data/viewPersonalData';

export class DisplayActiveLink extends Component {
    render() {
        let activeLinkId  = this.props.activeLinkId;
        if (activeLinkId === 'savePersonalDetails') {
            return (
                <SavePersonalData></SavePersonalData>            
            )           
        } else {
            return (
                <ViewPersonalData></ViewPersonalData>
            )
        }
    }
}
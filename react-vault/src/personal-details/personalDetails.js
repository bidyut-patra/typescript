import React, { Component } from 'react';
import { AptOwnerDetails } from './aptOwnerDetails';
import './personalDetails.css';
import { BankDetails } from './bankDetails';

export class PersonalDetails extends Component {
    render() {
        let details;
        const { type, data } = this.props;

        switch(type) {
            case 'resident':
                details = <AptOwnerDetails data={data}></AptOwnerDetails>;
                break;
            case 'bank':
                details = <BankDetails></BankDetails>;
                break;
            case 'mail':
                details = <AptOwnerDetails></AptOwnerDetails>;
                break;
            case 'system':
                details = <AptOwnerDetails></AptOwnerDetails>;
                break;
            case 'mobile':
                details = <AptOwnerDetails></AptOwnerDetails>;
                break;
            default:
                details = <AptOwnerDetails></AptOwnerDetails>;
                break;
        }

        return (
            <div>
                {details}
            </div>
        )
    }
}
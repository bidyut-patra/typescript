import React, { Component } from 'react';
import { AptOwnerDetails } from './aptOwnerDetails';
import { BankDetails } from './bankDetails';
import { MailAccountDetails } from './mailAccountDetails';
import { MobilePhoneDetails } from './mobilePhoneDetails';
import { SystemAccountDetails } from './systemAccountDetails';
import { ElectricityBillPayment } from './electricityBillPayment';
import { PodarAppData } from './podarAppData';
import { HpCylinderBooking } from './hpCylinderBooking';
import './personalDetails.css';

export class PersonalDetails extends Component {
    render() {
        let details;
        const { type, data } = this.props;

        switch(type) {
            case 'resident':
                details = <AptOwnerDetails data={data}></AptOwnerDetails>;
                break;
            case 'electricity':
                details = <ElectricityBillPayment></ElectricityBillPayment>;
                break;                
            case 'bank':
                details = <BankDetails></BankDetails>;
                break;
            case 'mail':
                details = <MailAccountDetails></MailAccountDetails>;
                break;
            case 'system':
                details = <SystemAccountDetails></SystemAccountDetails>;
                break;
            case 'mobile':
                details = <MobilePhoneDetails></MobilePhoneDetails>;
                break;
            case 'podar':
                details = <PodarAppData></PodarAppData>;
                break;         
            case 'hpcylinder':
                details = <HpCylinderBooking></HpCylinderBooking>;
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
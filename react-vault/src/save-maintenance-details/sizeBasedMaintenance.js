import React from 'react';
import { GetQueryObject } from '../utilities/others/location'

export function SizeBasedMaintenance(props) {
        if(!props.fetched) {
            loadMaintenanceData(props);
        }

        return (
            <div className="row" style={props.style}>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Amount with size above {props.maintenance.sizeAbove.size}</label>
                    <input className="form-control custom-font" value={props.maintenance.sizeAbove.amount}
                    onBlur={props.onBlurInput} ref={props.maintenanceInput} disabled={props.disabled} autoComplete="off"/>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Amount with size below {props.maintenance.sizeBelow.size}</label>
                    <input className="form-control custom-font" value={props.maintenance.sizeBelow.amount}
                    onBlur={props.onBlurInput} disabled={props.disabled} autoComplete="off"/>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Amount with size equal {props.maintenance.sizeEqual.size}</label>
                    <input className="form-control custom-font" value={props.maintenance.sizeEqual.amount}
                    onBlur={props.onBlurInput} disabled={props.disabled} autoComplete="off"/>
                </div>                                        
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Maintenance Type</label>
                    <input className="form-control custom-font" readOnly
                    value="Quarterly" autoComplete="off"/>
                </div>          
            </div>
        )
}

function loadMaintenanceData(props) {
    const queryObj = GetQueryObject();
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    let url = 'http://localhost:3000/data/api/maintenance?user=' + queryObj.user;
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            props.onFetchMaintenance(data);
        })
        .catch(error => {
            console.log(error);
        })
}
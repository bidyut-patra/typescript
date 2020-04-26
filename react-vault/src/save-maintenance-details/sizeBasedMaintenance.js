import React from 'react';
import { GetQueryObject } from '../utilities/others/location'

export function SizeBasedMaintenance(props) {
        if(!props.maintenanceState.fetched) {
            loadMaintenanceData(props);
        }

        return (
            <div className="row" style={props.style}>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Amount with size above {props.maintenance.sizeAbove.size}</label>
                    <input className="form-control custom-font" 
                    onKeyUp={e => props.onValueChange('sizeAbove', e.target.value)}
                    onBlur={() => props.onFocusInput('sizeAbove', true)}
                    defaultValue={props.maintenance.sizeAbove.amount}
                    ref={props.maintenanceState.sizeAbove.input}
                    disabled={props.maintenanceState.sizeAbove.disabled} autoComplete="off"/>
                    <button onClick={() => props.onFocusInput('sizeAbove', false)}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Amount with size below {props.maintenance.sizeBelow.size}</label>
                    <input className="form-control custom-font" 
                    onKeyUp={e => props.onValueChange('sizeBelow', e.target.value)}
                    onBlur={() => props.onFocusInput('sizeBelow', true)}
                    defaultValue={props.maintenance.sizeBelow.amount}
                    ref={props.maintenanceState.sizeBelow.input}
                    disabled={props.maintenanceState.sizeBelow.disabled} autoComplete="off"/>
                    <button onClick={() => props.onFocusInput('sizeBelow', false)}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                </div>
                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <label>Amount with size equal {props.maintenance.sizeEqual.size}</label>
                    <input className="form-control custom-font" 
                    onKeyUp={e => props.onValueChange('sizeEqual', e.target.value)}
                    onBlur={() => props.onFocusInput('sizeEqual', true)}
                    defaultValue={props.maintenance.sizeEqual.amount}
                    ref={props.maintenanceState.sizeEqual.input}
                    disabled={props.maintenanceState.sizeEqual.disabled} autoComplete="off"/>
                    <button onClick={() => props.onFocusInput('sizeEqual', false)}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
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
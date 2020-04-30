import React, { Component } from 'react';
import { SaveButton } from '../utilities/save-dialog/saveButton';
import { SizeBasedMaintenance } from './sizeBasedMaintenance';

export class SaveMaintenanceDetails extends Component {
    constructor() {
        super();

        this.state = {
            maintenance: {
                sizeAbove: {
                    size: '',
                    amount: ''                    
                },
                sizeBelow: {
                    size: '',
                    amount: ''                    
                },
                sizeEqual: {
                    size: '',
                    amount: ''                    
                }
            },
            maintenanceState: {
                fetched: false,
                sizeAbove: {
                    disabled: true,
                    input: React.createRef()
                },
                sizeBelow: {
                    disabled: true,
                    input: React.createRef()                  
                },
                sizeEqual: {
                    disabled: true,
                    input: React.createRef()               
                }
            },
            type: 'quarter',
            quarters: [
                {
                    type: 'first_quarter',
                    text: 'January - March'
                },
                {
                    type: 'second_quarter',
                    text: 'April - June'
                },
                {
                    type: 'third_quarter',
                    text: 'July - September'
                },
                {
                    type: 'fourth_quarter',
                    text: 'October - December'
                }                                                      
            ]            
        };

        this.onFetchMaintenance = this.onFetchMaintenance.bind(this);
        this.onFocusMaintenance = this.onFocusMaintenance.bind(this);
        this.onChangeMaintenance = this.onChangeMaintenance.bind(this);
    }

    componentDidMount() {
        
    }

    onFetchMaintenance = (maintenance) => {
        let maintenanceState = this.state.maintenanceState;
        maintenanceState.fetched = true;
        this.setState({
            maintenance: maintenance,
            maintenanceState: maintenanceState
        });
    }

    onFocusMaintenance = (inputLabel, disable) => {
        let maintenanceState = this.state.maintenanceState;
        let inputControl;
        console.log('disable: ', disable);
        switch(inputLabel) {
            case 'sizeAbove':
                maintenanceState.sizeAbove.disabled = disable;
                inputControl = maintenanceState.sizeAbove.input;
                break;
            case 'sizeBelow':
                maintenanceState.sizeBelow.disabled = disable;
                inputControl = maintenanceState.sizeBelow.input;
                break;
            case 'sizeEqual':
                maintenanceState.sizeEqual.disabled = disable;
                inputControl = maintenanceState.sizeEqual.input;
                break;
            default:
                break;
        }
        this.setState({
            maintenanceState: maintenanceState
        });
        // delay for 100ms before setting focus as disable is set to false
        setTimeout(() => inputControl.current.focus(), 100);
    }

    onChangeMaintenance = (inputLabel, value) => {
        let maintenance = this.state.maintenance;
        let valueInt = parseInt(value);
        console.log('v: ', value);
        switch(inputLabel) {
            case 'sizeAbove':
                maintenance.sizeAbove.amount = valueInt;
                break;
            case 'sizeBelow':
                maintenance.sizeBelow.amount = valueInt;
                break;
            case 'sizeEqual':
                maintenance.sizeEqual.amount = valueInt;
                break;
            default:
                break;
        }
    }

    render() {
        let style = {
            marginRight: 0,
            padding: 20
        }

        let saveBtn = <SaveButton btnLabel='Apply'
                        onFetchContent={(content) => this.getConfirmSaveContent(content)} style={style}
                        onFetchPostDetails={(content, binding) => this.getPostDataDetails(content, binding)} 
                        data={this.state.maintenance}>
                      </SaveButton>;            
        saveBtn = <div className="fixed-bottom save-section">{saveBtn}</div>    
        
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let currentQuarter = month / 3;

        return (
            <div className="personal-details-content">
                <SizeBasedMaintenance maintenance={this.state.maintenance} style={style} 
                maintenanceState={this.state.maintenanceState}
                onValueChange={(inputLabel, value) => this.onChangeMaintenance(inputLabel, value)} 
                onFocusInput={(inputLabel, focus) => this.onFocusMaintenance(inputLabel, focus)} 
                onFetchMaintenance={(maintenance) => this.onFetchMaintenance(maintenance)}>                    
                </SizeBasedMaintenance>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Select Quarter</label>
                        <select className="form-control custom-font">
                            {
                                this.state.quarters.map((q, i) => {
                                    return <option key={i} value={q.type} selected={currentQuarter === i}>{q.text}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Year</label>
                        <input className="form-control custom-font" readOnly
                        value={year} autoComplete="off"/>
                    </div>          
                </div>
                {saveBtn}
            </div>
        );
    }

    getPostDataDetails = (maintenance, binding) => {
        console.log('binding::', binding);
        let postData = {
            json: { maintenance: maintenance },
            url: 'http://localhost:3000/data/api/maintenance',
            error: '',            
        };
        return postData;
    }

    getConfirmSaveContent = (maintenance) => {
        let body = [];
        let style = {
            color: 'green'
        }
        let binding = {};
        if (maintenance) {
            binding.overwriteSelected = false;
            let msg = 'The new maintenance rate will be applied on each apartment from now onwards.';
            let maintenanceDiv = <div key='0'>
                                    <p>Size Above {maintenance.sizeAbove.size}</p>
                                    <h2 style={style}><i className="fas fa-rupee-sign"></i>{maintenance.sizeAbove.amount}</h2>
                                    <p>Size Below {maintenance.sizeBelow.size}</p>
                                    <h2 style={style}><i className="fas fa-rupee-sign"></i>{maintenance.sizeBelow.amount}</h2>
                                    <p>Size Equal {maintenance.sizeEqual.size}</p>
                                    <h2 style={style}><i className="fas fa-rupee-sign"></i>{maintenance.sizeEqual.amount}</h2>
                                    <br/>
                                    <h3 style={style}>{msg}</h3>
                                    <br/>
                                    <input type='checkbox' value={binding.overwriteSelected} 
                                    onChange={() => binding.overwriteSelected = true}/>
                                    <label>Overwrite last changes made on</label>
                                </div>;
            body.push(maintenanceDiv);
        } else {
            body.push(<p key='0' style={style}>There is no data to save.</p>);
        }
        return [body, binding];
    }
}
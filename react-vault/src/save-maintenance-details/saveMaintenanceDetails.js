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
                disabled: true
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

        this.maintenanceInput = React.createRef();

        this.onFetchMaintenance = this.onFetchMaintenance.bind(this);
        this.onEditMaintenance = this.onEditMaintenance.bind(this);
        this.onBlurMaintenance = this.onBlurMaintenance.bind(this);
    }

    componentDidMount() {
        
    }

    onFetchMaintenance = (maintenance) => {
        this.setState({
            maintenance: maintenance,
            maintenanceState: {
                fetched: true,
                disabled: true
            }
        });
    }

    onEditMaintenance = () => {
        this.setState({
            maintenanceState: {
                fetched: true,
                disabled: false
            }
        });
        setTimeout(() => {
            this.maintenanceInput.current.focus();
        }, 100)
    }

    onBlurMaintenance = () => {
        this.setState({
            maintenanceState: {
                fetched: true,
                disabled: true
            }
        });
    }

    render() {
        let style = {
            marginRight: 0,
            padding: 20
        }

        let saveBtn = <SaveButton onFetchContent={(content) => this.getConfirmSaveContent(content)} style={style}
        onFetchPostDetails={(content) => this.getPostDataDetails(content)} data={this.state.maintenance}></SaveButton>;            
        saveBtn = <div>{saveBtn}</div>

        let editBtn = <button className="btn btn-primary" onClick={this.onEditMaintenance}>Edit</button>;            
        editBtn = <div>{editBtn}</div>        
        
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let currentQuarter = month / 3;

        return (
            <div className="personal-details-content">
                <SizeBasedMaintenance maintenance={this.state.maintenance} 
                maintenanceInput={this.maintenanceInput}
                fetched={this.state.maintenanceState.fetched} 
                disabled={this.state.maintenanceState.disabled}
                onBlurInput={()=>this.onBlurMaintenance()} 
                onFetchMaintenance={(maintenance) =>this.onFetchMaintenance(maintenance)}>                    
                </SizeBasedMaintenance>
                <div className="row" style={style}>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Select Quarter</label>
                        <select className="form-control custom-font">
                            {
                                this.state.quarters.map((q, i) => {
                                    return <option key={i} defaultValue={currentQuarter === i} value={q.type}>{q.text}</option>
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
                <div className="fixed-bottom save-section">
                    <div>{saveBtn}{editBtn}</div>
                </div>
            </div>
        );
    }

    getPostDataDetails = (maintenance) => {
        let postData = {
            json: { maintenance: maintenance },
            url: 'http://localhost:3000/data/api/maintenance',
            error: '',            
        };
        return postData;
    }

    getConfirmSaveContent = (maintenance) => {
        let body = [];
        if (maintenance) {
            let maintenanceDiv = <div key='0'>
                             <h3>Size Above {maintenance.sizeAbove.size}</h3><p>{maintenance.sizeAbove.amount}</p>
                             <h3>Size Above {maintenance.sizeBelow.size}</h3><p>{maintenance.sizeBelow.amount}</p>
                             <h3>Size Above {maintenance.sizeEqual.size}</h3><p>{maintenance.sizeEqual.amount}</p>
                          </div>;
            body.push(maintenanceDiv);
        } else {
            body.push(<p key='0'>There is no data to save.</p>);
        }
        return body;
    }
}
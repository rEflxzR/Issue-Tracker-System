import React, { Component } from 'react'
import './displaybox.css'

class Displaybox extends Component {
    render() {
        return(
            <div className="display">
                <div className="display-header">
                    <div>
                        <h1 className="text-center text-uppercase h1 my-0"><strong>{this.props.title}</strong></h1>
                    </div>
                </div>
                <div className="display-footer">
                    <div className="details-table">
                        <div className="tabledata">
                            <div className="flatrow row my-3">
                                <div className="col col-12">
                                    <h4 className="text-uppercase"><strong>description</strong></h4>
                                    <p className="h5 text-capitalize">{this.props.description}</p>
                                </div>
                            </div>
                            {
                                this.props.moddedPropsKeys.map((key, index) => {
                                    if(index%2===0) {
                                        return <div className="datarow row my-3">
                                            <div className="col col-4">
                                                <h4 className="text-uppercase my-2"><strong>{this.props.moddedPropsKeys[index]}</strong></h4>
                                                <p className="h5 text-capitalize my-2">{this.props.moddedProps[this.props.moddedPropsKeys[index]]}</p>
                                            </div>
                                            <div className="col col-4">
                                                <h4 className="text-uppercase my-2"><strong>{this.props.moddedPropsKeys[index+1]}</strong></h4>
                                                <p className="h5 text-capitalize my-2">{this.props.moddedProps[this.props.moddedPropsKeys[index+1]]}</p>
                                            </div>
                                        </div>
                                    }
                                    return null
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Displaybox
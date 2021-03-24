import React, { Component } from 'react'
import './editbox.css'

class Editbox extends Component {
    render() {
        return(
            <div className="editbox">
                <div className="editbox-header">
                    <div>
                        <h1 className="text-center h1"><strong>EDIT INFO BOX</strong></h1>
                    </div>
                </div>
                <div className="editbox-footer"></div>
            </div>
        )
    }
}

export default Editbox
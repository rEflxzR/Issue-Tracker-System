import React, { Component } from 'react'
import './deletebox.css'

class Deletebox extends Component {
    render() {
        return(
            <div className="deletebox">
                <div className="deletebox-header">
                    <div>
                        <h1 className="text-center h1"><strong>DELETE ENTRY BOX</strong></h1>
                    </div>
                </div>
                <div className="deletebox-footer"></div>
            </div>
        )
    }
}

export default Deletebox
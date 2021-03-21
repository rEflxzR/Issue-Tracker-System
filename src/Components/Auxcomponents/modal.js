import React, { Component } from 'react'
import './modal.css'

class Modal extends Component {
    constructor() {
        super()

        this.closeModal = this.closeModal.bind(this)
    }

    closeModal() {
        this.props.toggleDisplay()
    }

    render() {
        return(
            <div className={this.props.display ? "modal-display" : "modal-hide"}>
                <div className="main-modal">
                    <h1 className="text-center">THIS IS THE MODAL</h1>
                    <div className="d-flex justify-content-center">
                        <button onClick={this.closeModal} className="btn btn-lg btn-danger">Close</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal
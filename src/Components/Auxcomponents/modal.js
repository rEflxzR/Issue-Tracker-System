import React, { Component } from 'react'
import Displaybox from './displaybox'
import Editbox from './editbox'
import Deletebox from './deletebox'
import './modal.css'

class Modal extends Component {
    constructor() {
        super()

        this.closeModal = this.closeModal.bind(this)
    }

    closeModal(evt) {
        this.props.toggleDisplay(evt)
    }

    render() {
        const moddedProps = {}
        const moddedPropsKeys = []
        if(this.props.projectDetails) {
            const projects = Object.keys(this.props.projectDetails).sort((a, b) => {
                return a-b
            })
            projects.map((key) => {
                if(key!=="description" && key!=="title") {
                    if(typeof(this.props.projectDetails[key])==="object") {
                        moddedProps[key] = this.props.projectDetails[key].join(", ")
                    }
                    else {
                        moddedProps[key] = this.props.projectDetails[key]
                    }
                    moddedPropsKeys.push(key)
                }
            })
        }
        return(
            <div className={this.props.display ? "modal-display" : "modal-hide"}>
                <div onClick={this.closeModal} className="main-modal">
                    <div className="modal-box">
                        {this.props.modalType==="detail" && <Displaybox moddedProps={moddedProps} moddedPropsKeys={moddedPropsKeys} title={this.props.projectDetails.title} description={this.props.projectDetails.description} />}
                        {this.props.modalType==="edit" && <Editbox />}
                        {this.props.modalType==="delete" && <Deletebox />}
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal
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
        if(this.props.projectDetails && this.props.modalType==="detail") {
            const projects = Object.keys(this.props.projectDetails)
            projects.map((key) => {
                if(key==="developers" || key==="testers") {
                    moddedProps[`project ${key}`] = this.props.projectDetails[key].join(", ")
                    moddedPropsKeys.push(`project ${key}`)
                }
                else if(key!=="description" && key!=="title") {
                    moddedProps[key] = this.props.projectDetails[key]
                    moddedPropsKeys.push(key)
                }
                return null
            })
            moddedPropsKeys.sort((a, b) => { return a.localeCompare(b) })
        }

        return(
            <div className={this.props.display ? "modal-display" : "modal-hide"}>
                <div onClick={this.closeModal} className="main-modal row">
                    <div onClick={this.closeModal} className="modal-box row offset-1">
                        {this.props.modalType==="detail" && <Displaybox moddedProps={moddedProps} moddedPropsKeys={moddedPropsKeys} title={this.props.projectDetails.title} description={this.props.projectDetails.description} />}
                        {this.props.modalType==="edit" && <div className={`col col-${this.props.showTicketComments ? 6 : 8}`}><Editbox projectInfo={{...this.props.projectDetails}} closeModal={this.closeModal} /></div>}
                        {this.props.showTicketComments && <div className="col col-6">{this.props.modalType==="edit" && <Editbox projectInfo={{...this.props.projectDetails}} closeModal={this.closeModal} />}</div>}
                        {this.props.modalType==="delete" && <Deletebox type={this.props.type} title={this.props.projectDetails.title} closeModal={this.closeModal} />}
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal
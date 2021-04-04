import React, { Component } from 'react'
import Displaybox from './displaybox'
import Editbox from './editbox'
import Deletebox from './deletebox'
import Box from './tablebox'
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
        const { modalType, modalCategory, showTickets, projectDetails } = this.props

        const moddedProps = {}
        const moddedPropsKeys = []
        if(projectDetails && modalType==="detail") {
            const projects = Object.keys(projectDetails)
            projects.map((key) => {
                if(key==="developers" || key==="testers") {
                    moddedProps[`project ${key}`] = projectDetails[key].join(", ")
                    moddedPropsKeys.push(`project ${key}`)
                }
                else if(key!=="description" && key!=="title") {
                    moddedProps[key] = projectDetails[key]
                    moddedPropsKeys.push(key)
                }
                return null
            })
            moddedPropsKeys.sort((a, b) => { return a.localeCompare(b) })
        }

        return(
            <div className={this.props.display ? "modal-display" : "modal-hide"}>
                <div onClick={this.closeModal} className="main-modal row">
                    <div onClick={this.closeModal} className={`${showTickets ? "modal-box-narrow" : "modal-box"} row offset-1`}>
                        {modalCategory==="project" && modalType==="detail" && <div className={`col col-${showTickets ? 6 : 10}`}><Displaybox moddedProps={moddedProps} moddedPropsKeys={moddedPropsKeys} title={projectDetails.title} description={projectDetails.description} /></div>}
                        {modalType==="edit" && <div className={`col col-${showTickets ? 6 : 8}`}><Editbox projectInfo={{...projectDetails}} closeModal={this.closeModal} /></div>}
                        {modalCategory==="project" && modalType==="delete" && <Deletebox type={modalCategory} title={projectDetails.title} closeModal={this.closeModal} />}

                        {/* {showTickets && <div className="col col-6"><Editbox projectInfo={{...projectDetails}} closeModal={this.closeModal} /></div>} */}

                        {modalCategory==="ticket" && modalType==="detail" && <div className={`col col-${showTickets ? 6 : 10}`}><Displaybox moddedProps={moddedProps} moddedPropsKeys={moddedPropsKeys} title={projectDetails.title} description={projectDetails.description} /></div>}
                        {/* {showTickets && <div><Box title="ticket commnets" body= /></div>} */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal
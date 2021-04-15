import React, { Component } from 'react'
import Displaybox from './displaybox'
import Editbox from './editbox'
import Deletebox from './deletebox'
import Box from './tablebox'
import './modal.css'

class Modal extends Component {
    constructor() {
        super()
        this.state = {
            currentPageNumber: 1,
            updateModal: false
        }

        this.closeModal = this.closeModal.bind(this)
        this.pageToggle = this.pageToggle.bind(this)
        this.updateEditModal = this.updateEditModal.bind(this)
    }

    componentWillUnmount() {
        if(this.props.modalCategory==="ticket" && this.props.modalType==="edit") {
            this.props.toggleDisplay("update")
        }
    }

    closeModal(evt) {
        this.props.toggleDisplay(evt)
    }

    pageToggle(param) {
        this.setState({ currentPageNumber: param })
    }

    updateEditModal(param) {
        this.setState({ updateModal: true }, () => {
            this.props.updateEditModal(param)
        })
    }

    render() {
        const { currentPageNumber } = this.state
        const { modalType, modalCategory, showTickets, entityInfo, projectName, projectManager } = this.props

        const moddedProps = {}
        const moddedPropsKeys = []
        if(entityInfo && modalType==="detail") {
            const projects = Object.keys(entityInfo)
            projects.map((key) => {
                if(key==="developers" || key==="testers") {
                    moddedProps[`project ${key}`] = entityInfo[key].join(", ")
                    moddedPropsKeys.push(`project ${key}`)
                }
                else if(key!=="description" && key!=="title" && key!=="comments") {
                    moddedProps[key] = entityInfo[key]
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
                        {modalCategory==="project" && modalType==="detail" && <div className={`col col-${showTickets ? 6 : 10}`}><Displaybox moddedProps={moddedProps} moddedPropsKeys={moddedPropsKeys} title={entityInfo.title} description={entityInfo.description} /></div>}
                        {modalCategory==="project" && modalType==="edit" && <div className={`col col-${showTickets ? 6 : 8}`}><Editbox modalCategory="Project" entityInfo={{...entityInfo}} closeModal={this.closeModal} /></div>}
                        {modalCategory==="project" && modalType==="delete" && <Deletebox type={modalCategory} title={entityInfo.title} manager={entityInfo.manager} closeModal={this.closeModal} />}


                        {modalCategory==="ticket" && modalType==="detail" && <div className={`col col-${showTickets ? 5 : 10}`}><Displaybox moddedProps={moddedProps} moddedPropsKeys={moddedPropsKeys} title={entityInfo.title} description={entityInfo.description} /></div>}
                        {modalType==="detail" && showTickets && <div className="col col-7"><Box title="Ticket Comments" body={entityInfo["comments"].slice(currentPageNumber*10-10, currentPageNumber*10)}
                            togglePage={this.pageToggle} totalEntries={entityInfo["comments"].length} page={currentPageNumber} 
                            heading={[{title:"COMMENT"}, {title:"DATE"}]}
                            width={[9,3]} smallFont={true} headColor={"#2cd499"}
                        /></div>}

                        {modalCategory==="ticket" && modalType==="edit" && <div className={`col col-${showTickets ? 4 : 8}`}><Editbox modalCategory="Ticket" entityInfo={{...entityInfo}} updateEditModal={this.updateEditModal} projectName={projectName} projectManager={projectManager} closeModal={this.closeModal} /></div>}
                        {modalType==="edit" && showTickets && <div className="col col-8"><Box title="Ticket Comments" body={entityInfo["comments"].slice(currentPageNumber*10-10, currentPageNumber*10)}
                            togglePage={this.pageToggle} totalEntries={entityInfo["comments"].length} page={currentPageNumber} 
                            heading={[{title:"COMMENT"}, {title:"DATE"}]}
                            width={[9,3]} smallFont={true} headColor={"#ffba24"}
                        /></div>}

                        {modalCategory==="ticket" && modalType==="delete" && <Deletebox type={modalCategory} title={entityInfo.title} projectName={projectName} closeModal={this.closeModal} />}</div>
                </div>
            </div>
        )
    }
}

export default Modal
import React, { Component } from 'react'
import axios from 'axios'
import Box from '../Auxcomponents/tablebox'
import Modal from '../Auxcomponents/modal'
import './userprojects.css'


const userRole = window.localStorage.getItem("Role")


class UserProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minProjectsData: [],
            detailedProjectsData: [],
            displayModal: false,
            modalType: "",
            currentPageNumber: 1,
            updateDisplay: false
        }

        this.pageToggle = this.pageToggle.bind(this)
        this.openEditModal = this.openEditModal.bind(this)
        this.openDeleteModal = this.openDeleteModal.bind(this)
        this.openDetailsModal = this.openDetailsModal.bind(this)
        this.toggleModalDisplay = this.toggleModalDisplay.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/userprojects`
        await axios.get(url, {withCredentials: true})
        .then((res) => {
            this.setState({ minProjectsData: res.data })
        })
        .catch((err) => {
            console.log("Could Not Send a Request to the Server")
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.updateDisplay!==this.state.updateDisplay) {
            const url = `http://${window.location.hostname}:3000/userprojects`
            await axios.get(url, {withCredentials: true})
            .then((res) => {
                this.setState({ minProjectsData: res.data, updateDisplay: false })
            })
            .catch((err) => {
                console.log("Could Not Send a Request to the Server")
            })
        }
    }

    async openDetailsModal(param1, param2) {
        const url = `http://${window.location.hostname}:3000/myprojectdetails`
        const title = param1
        const manager = param2
        await axios.get(url, {headers: {title, manager}}, {withCredentials: true})
        .then((res) => {
            this.setState({ detailedProjectsData: res.data, displayModal: true, modalType: "detail" })
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
        })
    }

    async openEditModal(param1, param2) {
        const url = `http://${window.location.hostname}:3000/myprojectdetails`
        const title = param1
        const manager = param2
        await axios.get(url, {headers: {title, manager}}, {withCredentials: true})
        .then((res) => {
            this.setState({ detailedProjectsData: res.data, displayModal: true, modalType: "edit" })
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
        })
    }

    openDeleteModal(param1, param2) {
        this.setState({ detailedProjectsData: {title: param1, manager: param2}, displayModal: true, modalType: "delete" })
    }

    toggleModalDisplay(param) {
        if(param==="closeModal") {
            this.setState({ displayModal: false, detailedProjectsData: [], modalType: "", updateDisplay: true })
        }
        if(param.currentTarget===param.target) {
            this.setState({ displayModal: false, detailedProjectsData: [], modalType: "" })
        }
    }

    pageToggle(param) {
        this.setState({ currentPageNumber: param })
    }

    render() {
        const {currentPageNumber, minProjectsData} = this.state
        return(
            <div>
                <div className="userprojectsbox row">
                    <div className="col col-10">
                        {
                            [...Array(currentPageNumber)].map((e, index) => {
                                return currentPageNumber===index+1 && <Box title="Your Projects" body={minProjectsData.slice(currentPageNumber*10-10, currentPageNumber*10)} 
                                togglePage={this.pageToggle} totalEntries={minProjectsData.length} page={currentPageNumber} 
                                heading={[{title:"TITLE"}, {title:"MANAGER"}, {title:"STATUS"}, {title: ""}, {title: ""}, {title: ""}]}
                                width={[3,3,2,1,1,2]} 
                                detailButton={true} buttonContentId="title" buttonContentSecondId="manager" detailsModal={this.openDetailsModal}
                                editButton={true} editModal={this.openEditModal}
                                disableEditButton={userRole==="developer" || userRole==="tester" ? true : false}
                                deleteButton={true} deleteModal={this.openDeleteModal} 
                                disableDeleteButton={userRole==="developer" || userRole==="tester" ? true : false}
                                />
                            })
                        }
                    </div>
                    <div className="userprojectmodal">
                        {this.state.displayModal && <Modal display={this.state.displayModal} modalType={this.state.modalType} toggleDisplay={this.toggleModalDisplay} 
                            entityInfo={this.state.detailedProjectsData} modalCategory="project" editModalContentUpdate={this.openEditModal}
                        />}
                    </div>
                </div>
            </div>
        )
    }
}

export default UserProjects
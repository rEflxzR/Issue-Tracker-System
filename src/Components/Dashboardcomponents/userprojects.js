import React, { Component } from 'react'
import axios from 'axios'
import Box from '../Auxcomponents/tablebox'
import Modal from '../Auxcomponents/modal'
import './userprojects.css'

class UserProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minProjectsData: [],
            detailedProjectsData: [],
            displayModal: false,
            modalType: "",
            currentPageNumber: 1
        }

        this.openDetailsModal = this.openDetailsModal.bind(this)
        this.openEditModal = this.openEditModal.bind(this)
        this.openDeleteModal = this.openDeleteModal.bind(this)
        this.toggleModalDisplay = this.toggleModalDisplay.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:8000/userprojects`
        const username = window.localStorage.getItem("Name")
        await axios.get(url, {headers: {username}}, {withCredentials: true})
        .then((res) => {
            this.setState({ minProjectsData: res.data })
        })
        .catch((err) => {
            console.log("Could Not Send a Request to the Server")
        })
    }

    async openDetailsModal(param) {
        const url = `http://${window.location.hostname}:8000/myprojectdetails`
        const title = param
        await axios.get(url, {headers: {title}}, {withCredentials: true})
        .then((res) => {
            this.setState({ detailedProjectsData: res.data, displayModal: true, modalType: "detail" })
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
        })
    }

    async openEditModal(param) {
        const url = `http://${window.location.hostname}:8000/myprojectdetails`
        const title = param
        await axios.get(url, {headers: {title}}, {withCredentials: true})
        .then((res) => {
            this.setState({ detailedProjectsData: res.data, displayModal: true, modalType: "edit" })
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
        })
    }

    openDeleteModal() {
        this.setState({ displayModal: true, modalType: "delete" })
    }

    toggleModalDisplay(param) {
        if(param.currentTarget===param.target) {
            this.setState({ displayModal: false, detailedProjectsData: [], modalType: "" })
        }
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
                                detailButton={true} buttonContentId="title" detailsModal={this.openDetailsModal}
                                editButton={true} editModal={this.openEditModal}
                                deleteButton={true} deleteModal={this.openDeleteModal}
                                />
                            })
                        }
                    </div>
                    <div className="userprojectmodal">
                        <Modal display={this.state.displayModal} modalType={this.state.modalType} toggleDisplay={this.toggleModalDisplay} 
                            projectDetails={this.state.detailedProjectsData} detailDescription={true}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default UserProjects
import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import { capitalize } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Box from '../Auxcomponents/tablebox'
import Modal from '../Auxcomponents/modal'
import './usertickets.css'


const ClearButton = styled(Button)({
    background: 'linear-gradient(to right, #f85032, #e73827)'
})
const SubmitButton = styled(Button)({
    background: 'linear-gradient(to right, #0575e6, #021b79)'
})


class UserTickets extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allUserProjects: [],
            currentUserProject: "",
            showTickets: false,
            updateTickets: false,
            projectTickets: [],
            ticketDetails: [],
            allProjectDevs: [],
            title: "",
            description: "",
            type: "",
            priority: "",
            currentPageNumber: 1,
            displayModal: false,
            modalType: ""
        }

        this.handleProjectSelectMenuChange = this.handleProjectSelectMenuChange.bind(this)
        this.handleNewTicketInputChange = this.handleNewTicketInputChange.bind(this)
        this.handleClearClick = this.handleClearClick.bind(this)
        this.handleSubmitClick = this.handleSubmitClick.bind(this)
        this.openDetailsModal = this.openDetailsModal.bind(this)
        this.openEditModal = this.openEditModal.bind(this)
        this.openDeleteModal = this.openDeleteModal.bind(this)
        this.toggleModalDisplay = this.toggleModalDisplay.bind(this)
        this.pageToggle = this.pageToggle.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/userprojects`
        const username = window.localStorage.getItem('Name')
        axios.get((url), {headers: {username}})
        .then((res) => {
            this.setState({ allUserProjects: res.data })
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.updateTickets!==this.state.updateTickets) {
            const url = `http://${window.location.hostname}:3000/projecttickets`
            const title = this.state.currentUserProject
            await axios.get((url), {headers: {title}})
            .then((res) => {
                this.setState({ updateTickets: false, projectTickets: res.data })
            })
            .catch((err) => {
                this.setState({ updateTickets:false, projectTickets: [] })
            })
        }
    }

    async handleProjectSelectMenuChange(evt) {
        const url = `http://${window.location.hostname}:3000/projecttickets`
        const title = evt.currentTarget.getAttribute("data-value")
        await axios.get((url), {headers: {title}})
        .then((res) => {
            this.setState({ showTickets: true, currentUserProject: title, projectTickets: res.data })
        })
        .catch((err) => {
            this.setState({ showTickets: false, currentUserProject: title, projectTickets: [] })
        })
    }

    handleNewTicketInputChange(evt) {
        const id = evt.currentTarget.getAttribute("id")
        if(id==="title" || id==="description") {
            this.setState({ [id]: evt.currentTarget.value })
        }
        else {
            this.setState({ [id]: evt.currentTarget.getAttribute("data-value") })
        }
    }

    handleClearClick() {
        this.setState({ title: "", description: "", type: "", priority: "" })
    }

    async handleSubmitClick() {
        const url = `http://${window.location.hostname}:3000/newticket`
        const {title, description, priority, type, currentUserProject} = this.state
        const tester = window.localStorage.getItem("Name")
        const currentdate = new Date() 
        const datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + ", " + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

        await axios.post((url), {title, description, priority, type, tester, datetime, currentUserProject})
        .then((res) => {
            this.setState({ updateTickets: true, title: "", description: "", type: "", priority: "" })
        })
        .catch((err) => {
            console.log("Could Not Send Request to the Server")
        })
    }


    async openDetailsModal(param) {
        const url = `http://${window.location.hostname}:3000/ticketdetails`
        const title = param
        const {currentUserProject} = this.state

        await axios.get(url, {headers: {title, currentUserProject}}, {withCredentials: true})
        .then((res) => {
            this.setState({ ticketDetails: res.data, displayModal: true, modalType: "detail" })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    async openEditModal(param) {
        const url = `http://${window.location.hostname}:3000/ticketdetails`
        const title = param
        const {currentUserProject} = this.state
        await axios.get(url, {headers: {title, currentUserProject}}, {withCredentials: true})
        .then((res) => {
            this.setState({ ticketDetails: res.data, displayModal: true, modalType: "edit" })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    openDeleteModal(param) {
        this.setState({ ticketDetails: {title: param}, displayModal: true, modalType: "delete" })
    }

    toggleModalDisplay(param) {
        if(param==="update") {
            this.setState({ updateTickets: true })
        }
        if(param==="closeModal") {
            this.setState({ displayModal: false, detailedProjectsData: [], modalType: "", updateDisplay: true })
        }
        if(param.currentTarget===param.target) {
            this.setState({ displayModal: false, ticketDetails: [], modalType: "", updateTickets: true })
        }
    }

    pageToggle(param) {
        this.setState({ currentPageNumber: param })
    }


    render() {
        const {currentPageNumber, projectTickets} = this.state
        return(
            <div>
                <div className="projectselectionform row">
                    <div className="formdiv col col-4 offset-4">
                        <FormControl required className="projectselectmenu">
                            <InputLabel>Please Select A Project</InputLabel>
                            <Select value={this.state.currentUserProject} onChange={this.handleProjectSelectMenuChange}>
                                {
                                    this.state.allUserProjects.map((project) => {
                                        return <MenuItem key={project.title} value={project.title}>{project.title}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <div className="projecttickets row">
                    {
                        !this.state.showTickets ? (null) : (
                                <div className="newticketform col col-4">
                                <form>
                                    <h2 className="text-center text-light py-5" style={{ backgroundColor: 'rgb(6, 6, 83)' }}><strong>ADD A NEW TICKET</strong></h2>
                                    <div className="ticketformfield my-4">
                                        <TextField className="ticketforminput" required value={this.state.title} onChange={this.handleNewTicketInputChange} id="title" label="Enter A Title for the Ticket" type="text"/>
                                    </div>
                                    <div className="ticketformfield my-4">
                                        <TextField className="ticketforminput" required value={this.state.description} onChange={this.handleNewTicketInputChange} id="description" label="Enter a Brief Description for the Ticket" type="text"/>
                                    </div>
                                    <div className="ticketformfield my-4">
                                        <FormControl className="ticketforminput" required>
                                            <InputLabel>Ticket Issue Type</InputLabel>
                                            <Select onChange={this.handleNewTicketInputChange} value={this.state.type} >
                                                <MenuItem id="type" value="Functional">Functional</MenuItem>
                                                <MenuItem id="type" value="Performance">Performance</MenuItem>
                                                <MenuItem id="type" value="Usability">Usability</MenuItem>
                                                <MenuItem id="type" value="Compatibility">Compatibility</MenuItem>
                                                <MenuItem id="type" value="Security">Security</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="ticketformfield my-4">
                                        <FormControl className="ticketforminput" required>
                                            <InputLabel>Ticket Priority</InputLabel>
                                            <Select onChange={this.handleNewTicketInputChange} value={this.state.priority} >
                                                <MenuItem id="priority" value="High">High</MenuItem>
                                                <MenuItem id="priority" value="Medium">Medium</MenuItem>
                                                <MenuItem id="priority" value="Low">Low</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="ticketformbuttons my-5">
                                        <SubmitButton className="text-light" onClick={this.handleClearClick} size="large" variant="contained"><strong>Reset Details</strong></SubmitButton>
                                        <ClearButton className="text-light" onClick={this.handleSubmitClick} size="large" variant="contained"><strong>Submit Ticket</strong></ClearButton>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {!this.state.showTickets ? (null) : (
                        <div className="col col-8">
                            {
                                [...Array(currentPageNumber)].map((e, index) => {
                                    return currentPageNumber===index+1 && <Box title={`${capitalize(this.state.currentUserProject)} - All Tickets`} body={projectTickets.slice(currentPageNumber*10-10, currentPageNumber*10)} 
                                    togglePage={this.pageToggle} totalEntries={projectTickets.length} page={currentPageNumber} 
                                    heading={[{title:"TICKET NAME"}, {title:"STATUS"}, {title:"PRIORITY"}, {title: ""}, {title: ""}, {title: ""}]}
                                    width={[4,3,2,1,1,1]} 
                                    detailButton={true} buttonContentId="title" detailsModal={this.openDetailsModal}
                                    editButton={true} editModal={this.openEditModal}
                                    deleteButton={true} deleteModal={this.openDeleteModal}
                                    />
                                })
                            }
                        </div>
                    )}
                </div>
                <div className="userticketmodal">
                    {this.state.displayModal && <Modal display={this.state.displayModal} modalType={this.state.modalType} toggleDisplay={this.toggleModalDisplay} 
                        entityInfo={this.state.ticketDetails} modalCategory="ticket" showTickets={true} updateEditModal={this.openEditModal} projectName={this.state.currentUserProject}
                    />}
                </div>
            </div>
        )
    }
}

export default UserTickets
import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/core/styles';
import Box from '../Auxcomponents/tablebox'
import Modal from '../Auxcomponents/modal'
import './manageprojects.css'


const ClearButton = styled(Button)({
    background: 'linear-gradient(to right, #f85032, #e73827)'
})
const SubmitButton = styled(Button)({
    background: 'linear-gradient(to right, #0575e6, #021b79)'
})

const userRole = window.localStorage.getItem("Role")


class ManageProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            description: "",
            projectManagers: [],
            developers: [],
            testers: [],
            Manager: "",
            Developer: [],
            Tester: [],
            projectData: [],
            projectDetails: [],
            currentPageNumber: 1,
            formError: false,
            update: false,
            displayModal: false,
            modalType: ""
        }

        this.handleProjectTextInputChange = this.handleProjectTextInputChange.bind(this)
        this.handleProjectManagerChange = this.handleProjectManagerChange.bind(this)
        this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this)
        this.handleClearButtonClick = this.handleClearButtonClick.bind(this)
        this.handleDeveloperChange = this.handleDeveloperChange.bind(this)
        this.handleTesterChange = this.handleTesterChange.bind(this)
        this.openDetailsModal = this.openDetailsModal.bind(this)
        this.toggleModalDisplay = this.toggleModalDisplay.bind(this)
        this.pageToggle = this.pageToggle.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/userandprojectdetails`
        await axios.get(url)
        .then((res) => {
            const { managers, developers, testers, projects } = res.data.content
            this.setState({ projectManagers: managers, developers: developers, testers: testers, projectData: projects })
        })
        .catch((err) => {
            console.log("Some Error Occurred While Sending the Request to the Server")
            console.log(err)
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.update!==this.state.update) {
            const url = `http://${window.location.hostname}:3000/allprojects`
            await axios.get(url).then((res) => {
                this.setState({ projectData: res.data.content.finalresult, update: false })
            })
            .catch((err) => {
                console.log("Failed to Get New Projects from the Server")
                console.log(err)
            })
        }
    }

    handleProjectTextInputChange(evt) {
        if(evt.currentTarget.id==="projecttitle") {
            this.setState({ title: evt.currentTarget.value })
        }
        else {
            this.setState({ description: evt.currentTarget.value })
        }
    }

    handleProjectManagerChange(evt) {
        this.setState({ Manager: evt.currentTarget.getAttribute("data-value") })
    }

    handleDeveloperChange(evt) {
        const devname = evt.currentTarget.getAttribute("data-value")
        if(this.state.Developer.indexOf(devname)===-1) {
            this.setState({ Developer: [...this.state.Developer, devname] })
        }
    }

    handleTesterChange(evt) {
        const testname = evt.currentTarget.getAttribute("data-value")
        if(this.state.Tester.indexOf(testname)===-1) {
            this.setState({ Tester: [...this.state.Tester, testname] })
        }
    }

    handleClearButtonClick() {
        this.setState({ title: "", description: "", Manager: "", Developer: [], Tester: [] })
    }

    async handleSubmitButtonClick(evt) {
        evt.preventDefault()
        const form = evt.currentTarget.form
        if(form.reportValidity()) {
            const url = `http://${window.location.hostname}:3000/newproject`
            const { title, description, Developer, Manager, Tester } = this.state
            const currentdate = new Date() 
            const datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" 
            + currentdate.getFullYear() + ", " + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })

            await axios.post(url, {title, description, Developer, Manager, Tester, datetime})
            .then((res) => {
                this.setState({ title: "", description: "", Manager: "", Developer: [], Tester: [], update: true })
            })
            .catch((err) => {
                this.setState({ title: "", formError: true })
                console.log(err)
            })
        }
    }

    pageToggle(param) {
        this.setState({ currentPageNumber: param })
    }

    async openDetailsModal(param1, param2) {
        const title = param1
        const manager = param2
        const url = `http://${window.location.hostname}:3000/projectdetails`
        await axios.get(url, {headers: {title, manager}})
        .then((res) => {
            this.setState({ projectDetails: res.data, displayModal: true, modalType: "detail" })
        })
        .catch((err) => {
            console.log("Error Sending Request to the Server")
            console.log(err)
            this.setState({ projectDetails: [], displayModal: false, modalType: "" })
        })
    }

    toggleModalDisplay(param) {
        if(param.currentTarget===param.target) {
            this.setState({ displayModal: false })
        }
    }

    render() {
        const { projectData, currentPageNumber } = this.state
        return (
            <div>
                <div className="userprojectrow row">
                    <div className="projectform col col-4">
                        <form>
                            <h2 className="text-center text-light py-5" style={{ backgroundColor: 'rgb(6, 6, 83)' }}><strong>NEW PROJECT</strong></h2>
                            <div className="projectforminputdiv my-4">
                                <TextField helperText={this.state.formError ? 'Project Title Already Exists' : ''} error={this.state.formError} onClick={() => {this.setState({ formError: false })}} required value={this.state.title} onChange={this.handleProjectTextInputChange} id="projecttitle" className="titleinput py-2" label="Enter Project Title" type="text"/>
                            </div>
                            <div className="projectforminputdiv my-4">
                                <TextField required value={this.state.description} onChange={this.handleProjectTextInputChange} id="projectdescription" className="descriptioninput py-2" label="Enter Project Description" type="text"/>
                            </div>
                            <div className="projectforminputdiv my-4">
                                <FormControl required className="userselectmenu">
                                    <InputLabel>Project Manager</InputLabel>
                                    <Select value={this.state.Manager} onChange={this.handleProjectManagerChange}>
                                        {
                                            this.state.projectManagers.map((pm) => {
                                                return <MenuItem key={pm.username} value={pm.username}>{pm.username}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="projectforminputdiv my-4">
                                <FormControl required className="userselectmenu">
                                    <InputLabel>Developers</InputLabel>
                                    <Select renderValue={() => {return this.state.Developer.join(", ")}} value={this.state.Developer} onChange={this.handleDeveloperChange}>
                                        {
                                            this.state.developers.map((dev) => {
                                                return <MenuItem key={dev.username} value={dev.username}>{dev.username}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="projectforminputdiv my-4">
                                <FormControl required className="userselectmenu">
                                    <InputLabel>Testers</InputLabel>
                                    <Select renderValue={() => {return this.state.Tester.join(", ")}} value={this.state.Tester} onChange={this.handleTesterChange}>
                                        {
                                            this.state.testers.map((test) => {
                                                return <MenuItem key={test.username} value={test.username}>{test.username}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="projectformbuttondiv my-5">
                                <div className="projectformbuttons">
                                    <ClearButton className="text-light" disabled={userRole==="admin" || userRole==="projectmanager" ? false : true} 
                                    onClick={this.handleClearButtonClick} size="large" variant="contained"><strong>CLEAR</strong></ClearButton>
                                    <SubmitButton className="text-light" disabled={userRole==="admin" || userRole==="projectmanager" ? false : true} 
                                    onClick={this.handleSubmitButtonClick} size="large" variant="contained"><strong>SUBMIT</strong></SubmitButton>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="projectbox col col-7">
                        {
                            [...Array(currentPageNumber)].map((e, index) => {
                                return currentPageNumber===index+1 && <Box title="All Projects" body={projectData.slice(currentPageNumber*10-10, currentPageNumber*10)} 
                                togglePage={this.pageToggle} totalEntries={projectData.length} page={currentPageNumber} 
                                heading={[{title:"TITLE"}, {title:"MANAGER"}, {title:"STATUS"}, {title: ""}]}
                                width={[4,3,3,2]} 
                                detailButton={true} buttonContentId="title" detailsModal={this.openDetailsModal}
                                />
                            })
                        }
                    </div>
                    <div className="detialsModal">
                        {this.state.displayModal && <Modal display={this.state.displayModal} modalType={this.state.modalType} toggleDisplay={this.toggleModalDisplay} 
                            entityInfo={this.state.projectDetails} modalCategory="project"
                        />}
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageProjects
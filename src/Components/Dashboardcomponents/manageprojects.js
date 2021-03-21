import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Box from '../Auxcomponents/tablebox'
import './manageprojects.css'

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
            allProjectDetails: [],
            currentPageNumber: 1,
            formError: false,
            update: false
        }

        this.handleProjectTextInputChange = this.handleProjectTextInputChange.bind(this)
        this.handleProjectManagerChange = this.handleProjectManagerChange.bind(this)
        this.handleDeveloperChange = this.handleDeveloperChange.bind(this)
        this.handleTesterChange = this.handleTesterChange.bind(this)
        this.handleClearButtonClick = this.handleClearButtonClick.bind(this)
        this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this)
        this.pageToggle = this.pageToggle.bind(this)
        this.openDetailsModal = this.openDetailsModal.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/userandprojectdetails`
        await axios.get(url)
        .then((res) => {
            const { managers, developers, testers, projects, projectsFullDetails } = res.data.content
            this.setState({ projectManagers: managers, developers: developers, testers: testers, projectData: projects, allProjectDetails: projectsFullDetails })
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
                this.setState({ projectData: res.data.content.finalresult, allProjectDetails: res.data.content.finalresultFullDetails, update: false })
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
            + currentdate.getFullYear() + ", " + currentdate.getHours() 
            + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();

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

    openDetailsModal(val) {
        console.log(val)
    }

    render() {
        const { projectData, currentPageNumber } = this.state
        return (
            <div>
                <div className="userprojectrow row">
                    <div className="projectform col col-3">
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
                                    <Select value={this.state.Developer} onChange={this.handleDeveloperChange}>
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
                                    <Select value={this.state.Tester} onChange={this.handleTesterChange}>
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
                                    <Button disabled={window.localStorage.getItem("Role")==="admin" || window.localStorage.getItem("Role")==="projectmanager" ? false : true} 
                                    onClick={this.handleClearButtonClick} size="large" variant="contained" color="secondary"><strong>CLEAR</strong></Button>
                                    <Button disabled={window.localStorage.getItem("Role")==="admin" || window.localStorage.getItem("Role")==="projectmanager" ? false : true} 
                                    onClick={this.handleSubmitButtonClick} size="large" variant="contained" color="primary"><strong>SUBMIT</strong></Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="projectbox col col-9">
                        {
                            [...Array(currentPageNumber)].map((e, index) => {
                                return currentPageNumber===index+1 && <Box title="All Projects" body={projectData.slice(currentPageNumber*10-10, currentPageNumber*10)} 
                                togglePage={this.pageToggle} totalEntries={projectData.length} page={currentPageNumber} 
                                heading={[{title:"TITLE"}, {title:"MANAGER"}, {title:"STATUS"}, {title: "DATE CREATED"}, {title: ""}]}
                                width={[3,3,2,3,1]} showButtons={true} buttonText="Details" buttonUUID="title" detailsModal={this.openDetailsModal}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageProjects
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
            currentPageNumber: 1,
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
        const url = `http://${window.location.hostname}:8000/userandprojectdetails`
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
            const url = `http://${window.location.hostname}:8000/allprojects`
            await axios.get(url).then((res) => {
                this.setState({ projectData: res.data.content, update: false })
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
            this.setState({ Developer: [...this.state.Developer, evt.currentTarget.getAttribute("data-value")] })
        }
    }

    handleTesterChange(evt) {
        const testname = evt.currentTarget.getAttribute("data-value")
        if(this.state.Tester.indexOf(testname)===-1) {
            this.setState({ Tester: [...this.state.Tester, evt.currentTarget.getAttribute("data-value")] })
        }
    }

    handleClearButtonClick() {
        this.setState({ title: "", description: "", Manager: "", Developer: [], Tester: [] })
    }

    async handleSubmitButtonClick() {
        const url = `http://${window.location.hostname}:8000/newproject`
        const { title, description, Developer, Manager, Tester } = this.state
        await axios.post(url, {title, description, Developer, Manager, Tester})
        .then((res) => {
            this.setState({ title: "", description: "", Manager: "", Developer: [], Tester: [], update: true })
        })
        .catch((err) => {
            this.setState({ title: "", description: "", Manager: "", Developer: [], Tester: [] }, () => {
                alert("Project Title Must be Unique")
            })
            console.log(err)
        })
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
                                <TextField required value={this.state.title} onChange={this.handleProjectTextInputChange} id="projecttitle" className="titleinput py-2" label="Enter Project Title" type="text"/>
                            </div>
                            <div className="projectforminputdiv my-4">
                                <TextField required value={this.state.description} onChange={this.handleProjectTextInputChange} id="projectdescription" className="descriptioninput py-2" label="Enter Project Description" type="text"/>
                            </div>
                            <div className="projectforminputdiv my-4">
                                <FormControl required className="userselectmenu">
                                    <InputLabel id="demo-simple-select-label">Project Manager</InputLabel>
                                    <Select labelId="demo-simple-select-label" value={this.state.Manager} onChange={this.handleProjectManagerChange}>
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
                                    <InputLabel id="demo-simple-select-label">Developers</InputLabel>
                                    <Select labelId="demo-simple-select-label" value={this.state.Developer} onChange={this.handleDeveloperChange}>
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
                                    <InputLabel id="demo-simple-select-label">Testers</InputLabel>
                                    <Select labelId="demo-simple-select-label" value={this.state.Tester} onChange={this.handleTesterChange}>
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
                                    <Button onClick={this.handleClearButtonClick} size="large" variant="contained" color="secondary"><strong>CLEAR</strong></Button>
                                    <Button onClick={this.handleSubmitButtonClick} size="large" variant="contained" color="primary"><strong>SUBMIT</strong></Button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="projectbox col col-9">
                        {
                            [...Array(currentPageNumber)].map((e, index) => {
                                return currentPageNumber===index+1 && <Box title="All Projects" body={projectData.slice(currentPageNumber*10-10, currentPageNumber*10)} 
                                togglePage={this.pageToggle} totalEntries={projectData.length} page={currentPageNumber} 
                                heading={[{title:"TITLE"}, {title:"DESCRIPTION"}, {title:"MANAGER"}, {title: ""}]}
                                width={[2,6,3,1]} showButtons={true} buttonText="Details" buttonUUID="title" detailsModal={this.openDetailsModal}
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
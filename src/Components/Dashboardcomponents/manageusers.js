import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Box from '../Auxcomponents/genericbox'
import './manageusers.css'

class ManageUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: [],
            names: ["ReflxzR", "rEplan", "JanzWE", "qLimAxz", "MAC", "sLWx"],
            personName: [],
            personRole: "",
            currentPageNumber: 1,
            update: false
        }

        this.handleSubmitClick = this.handleSubmitClick.bind(this)
        this.handleClearClick = this.handleClearClick.bind(this)
        this.handleRoleAssignmentChange = this.handleRoleAssignmentChange.bind(this)
        this.handleRoleMenuChange = this.handleRoleMenuChange.bind(this)
        this.pageToggle = this.pageToggle.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:8000/users`
        await axios.get(url)
        .then((res) => {
            this.setState({ userData: res.data })
        })
        .catch((err) => {
            console.log(err)
            console.log("Request Failed")
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if(prevState.update!==this.state.update) {
            const url = `http://${window.location.hostname}:8000/users`
            await axios.get(url)
            .then((res) => {
                this.setState({ userData: res.data, update: false })
            })
            .catch((err) => {
                console.log(err)
                console.log("Request Failed")
            })
        }
    }

    pageToggle(param) {
        this.setState({ currentPageNumber: param })
    }

    handleRoleAssignmentChange(evt) {
        const { options } = evt.target
        const values = []
        for(let option of options) {
            if(option.selected) {
                values.push(option.value)
            }
        }
        this.setState({ personName: values })
    }

    handleClearClick() {
        this.setState({ personName: [] })
    }

    handleRoleMenuChange(evt) {
        this.setState({ personRole: evt.currentTarget.getAttribute("data-value") })
    }

    async handleSubmitClick() {
        const url = `http://${window.location.hostname}:8000/updateusers`
        const { personName, personRole } = this.state
        await axios.post(url, {personName, personRole})
        .then((res) => {
            this.setState({ personName: [], personRole: "", update: true })
        })
        .catch((err) => {
            console.log("Error Sending the Request to the Server")
            console.log(err)
        })
    }

    render() {
        const { userData, currentPageNumber } = this.state
        return(
            <div>
                <div className="row mainrow">
                    <div className="col col-4">
                        <div className="userform px-5">
                            <form>
                                <h2 className="py-5 text-center">Manage User Roles</h2>
                                <FormControl required className="userselectmenu">
                                    <InputLabel shrink>Select 1 or more Users</InputLabel>
                                    <Select disabled={window.localStorage.getItem("role")==="admin" ? false : true} multiple native value={this.state.personName} onChange={this.handleRoleAssignmentChange}>
                                        {
                                            this.state.userData.map((user) => {
                                                return <option key={user.username} value={user.username}>{user.username}</option>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <div className="my-3">
                                    <FormControl required className="rolemenu">
                                        <InputLabel id="demo-simple-select-label">Select A Role to Assign</InputLabel>
                                        <Select labelId="demo-simple-select-label" value={this.state.personRole} onChange={this.handleRoleMenuChange}>
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="projectmanager">Project Manager</MenuItem>
                                            <MenuItem value="developer">Developer</MenuItem>
                                            <MenuItem value="tester">Tester</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="formbuttons my-4">
                                    <Button disabled={window.localStorage.getItem("role")==="admin" ? false : true} onClick={this.handleClearClick} size="large" variant="contained" color="primary">Clear Choices</Button>
                                    <Button disabled={window.localStorage.getItem("role")==="admin" ? false : true} onClick={this.handleSubmitClick} size="large" variant="contained" color="primary">Submit</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col col-8">
                        {
                            [...Array(currentPageNumber)].map((e, index) => {
                                return currentPageNumber==index+1 && <Box title="All Users" users={userData.slice(currentPageNumber*10-10, currentPageNumber*10)} togglePage={this.pageToggle} totalEntries={userData.length} page={currentPageNumber} />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageUsers
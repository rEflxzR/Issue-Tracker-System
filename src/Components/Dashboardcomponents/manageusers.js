import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/core/styles'
import Box from '../Auxcomponents/tablebox'
import './manageusers.css'


const ClearButton = styled(Button)({
    background: 'linear-gradient(to right, #f85032, #e73827)'
})
const SubmitButton = styled(Button)({
    background: 'linear-gradient(to right, #0575e6, #021b79)'
})

const userRole = window.localStorage.getItem("Role")


class ManageUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: [],
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
        const url = `http://${window.location.hostname}:3000/users`
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
            const url = `http://${window.location.hostname}:3000/users`
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
        const { options } = evt.currentTarget
        const values = []
        for(let option of options) {
            if(option.selected) {
                values.push(option.value)
            }
        }
        this.setState({ personName: values })
    }

    handleClearClick() {
        this.setState({ personName: [], personRole: "" })
    }

    handleRoleMenuChange(evt) {
        this.setState({ personRole: evt.currentTarget.getAttribute("data-value") })
    }

    async handleSubmitClick(evt) {
        evt.preventDefault()
        const form = evt.currentTarget.form
        if(form.reportValidity()) {
            const url = `http://${window.location.hostname}:3000/updateusers`
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
    }

    render() {
        const { userData, currentPageNumber } = this.state
        return(
            <div>
                <div className="row mainrow">
                    <div className="userformcolumn col col-4">
                    <h2 className="py-5 my-0 text-center text-light" style={{ backgroundColor: 'rgb(6, 6, 83)' }}><strong>Manage User Roles</strong></h2>
                        <div className="userform px-5">
                            <form>
                                <FormControl required className="mt-5" style={{ width: '100%' }}>
                                    <InputLabel shrink>Select 1 or more Users</InputLabel>
                                    <Select multiple native value={this.state.personName} onChange={this.handleRoleAssignmentChange}>
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
                                    <ClearButton className="text-light" disabled={userRole==="admin" ? false : true} onClick={this.handleClearClick} size="large" variant="contained"><strong>Clear Choices</strong></ClearButton>
                                    <SubmitButton className="text-light" disabled={userRole==="admin" ? false : true} onClick={this.handleSubmitClick} size="large" variant="contained"><strong>Submit</strong></SubmitButton>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col col-8">
                        {
                            [...Array(currentPageNumber)].map((e, index) => {
                                return currentPageNumber===index+1 && <Box title="All Users" body={userData.slice(currentPageNumber*10-10, currentPageNumber*10)} 
                                togglePage={this.pageToggle} totalEntries={userData.length} page={currentPageNumber} 
                                heading={[{title:"NAME"}, {title:"EMAIL"}, {title:"ROLE"}]}
                                width={[3,6,3]}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageUsers
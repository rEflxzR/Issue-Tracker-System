import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import './editbox.css'
import { capitalize } from '@material-ui/core';

class Editbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...props.projectInfo,
            allDevs: [],
            allTesters: []
        }

        this.editFormInputFieldChange = this.editFormInputFieldChange.bind(this)
        this.editFormSelectFieldChange = this.editFormSelectFieldChange.bind(this)
        this.handleEditFormButtonClick = this.handleEditFormButtonClick.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:8000/devsandtesters`
        await axios.get(url)
        .then((res) => {
            const allDevs = []
            const allTesters = []
            res.data.forEach((user) => {
                if(user.role==="developer") {
                    allDevs.push(user.username)
                }
                else {
                    allTesters.push(user.username)
                }
            })
            this.setState({ allDevs, allTesters })
        })
        .catch((err) => {
            console.log(err)
            console.log("Failed to Send a Request to the Server")
        })
    }

    editFormInputFieldChange(evt) {
        const { id } = evt.currentTarget
        this.setState({ [id]: evt.currentTarget.value })
    }

    editFormSelectFieldChange(evt) {
        const id = evt.currentTarget.getAttribute("menuid")
        const value = evt.currentTarget.getAttribute("data-value")

        if(id==="developers" || id==="testers") {
            const indexval = this.state[id].indexOf(value)
            if(indexval===-1) {
                this.setState({ [id]: [value, ...this.state[id]] })
            }
            else {
                let arr = [...this.state[id]]
                arr = arr.slice(0, indexval).concat(arr.slice(indexval+1))
                this.setState({ [id]: arr})
            }
        }
        else {
            this.setState({ [id]: value })
        }
    }

    async handleEditFormButtonClick(evt) {
        const id = evt.currentTarget.getAttribute("buttonId")
        if(id==="reset") {
            this.setState({ ...this.props.projectInfo })
        }
        else {
            const url = `http://${window.location.hostname}:8000/projectupdate`
            await axios.post(url)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    render() {
        return(
            <div className="editbox">
                <div className="editbox-header">
                    <div>
                        <h1 className="text-center h1 my-0"><strong>EDIT PROJECT DETAILS</strong></h1>
                    </div>
                </div>
                <div className="editbox-footer">
                    <div className="editModalForm">
                        <form>
                            <div className="editFormInputField mx-auto">
                                <TextField value={this.state.title} onChange={this.editFormInputFieldChange} id="title" className="fieldInnerDiv" label="Project Title" type="text"/>
                            </div>
                            <div className="editFormInputField mx-auto">
                                <TextField value={this.state.description} onChange={this.editFormInputFieldChange} id="description" className="fieldInnerDiv" label="Project Description" type="text"/>
                            </div>
                            <div className="editFormInputField mx-auto">
                                <FormControl className="fieldInnerDiv">
                                    <InputLabel>Project Status</InputLabel>
                                    <Select onChange={this.editFormSelectFieldChange} renderValue={() => capitalize(this.state.status)} value={this.state.status}>
                                        <MenuItem menuid="status" value="Open">Open</MenuItem>
                                        <MenuItem menuid="status" value="Complete">Complete</MenuItem>
                                        <MenuItem menuid="status" value="Abandoned">Abandoned</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="editFormInputField mx-auto">
                                <FormControl className="fieldInnerDiv">
                                    <InputLabel>Project Developers</InputLabel>
                                    <Select multiple onChange={this.editFormSelectFieldChange} renderValue={() => this.state.developers.join(", ")} value={this.state.developers}>
                                        {
                                            this.state.allDevs.map((dev) => {
                                                return <MenuItem menuid="developers" value={dev}>{dev}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="editformButtonfield mx-auto">
                                <Button onClick={this.handleEditFormButtonClick} buttonId="reset" size="large" variant="contained" color="primary">RESET</Button>
                                <Button onClick={this.handleEditFormButtonClick} buttonId="submit" size="large" variant="contained" color="secondary">SUBMIT</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Editbox
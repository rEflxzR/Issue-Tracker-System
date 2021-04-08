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
            ...props.entityInfo,
            allDevs: [],
            allTesters: [],
            comment: "",
            oldTitle: props.entityInfo.title
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

        if( this.props.modalCategory==="Project" || id==="developers" || id==="testers") {
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
            if(id==="developer assigned") {
                this.setState({ [id]: value, status: "In Progress" })
            }
            else {
                this.setState({ [id]: value })
            }
        }
    }

    async handleEditFormButtonClick(evt) {
        const id = evt.currentTarget.getAttribute("buttonid")
        if(id==="reset") {
            this.setState({ ...this.props.entityInfo, comment: "" })
        }
        else {
            if(this.props.modalCategory==="Project") {
                const url = `http://${window.location.hostname}:8000/updateprojectdetails`
                const { title, oldTitle, description, developers, testers, status } = this.state
                await axios.post(url, {title, oldTitle, description, status, developers, testers})
                .then((res) => {
                    this.props.closeModal("closeModal")
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            else {
                const url = `http://${window.location.hostname}:8000/updateticketdetails`
                const { title, oldTitle, description, ['developer assigned']: developer, comment, status, priority } = this.state
                const type = this.state.type.split(" ")[0]
                await axios.post(url, { title, oldTitle, description, developer, comment, status, type, priority })
                .then((res) => {
                    this.setState({ comment: "" }, () => {
                        this.props.updateEditModal(this.state.title)
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        }
    }

    render() {
        const { modalCategory } = this.props
        return(
            <div className="editbox">
                <div className="editbox-header">
                    <div>
                        <h1 className="text-center text-uppercase h1 my-0"><strong>EDIT {modalCategory} DETAILS</strong></h1>
                    </div>
                </div>
                <div className="editbox-footer">
                    <div className="editModalForm">
                        <form>
                            <div className="editFormInputField mx-auto">
                                <TextField value={this.state.title} onChange={this.editFormInputFieldChange} id="title" className="fieldInnerDiv" label={`${modalCategory} Title`} type="text"/>
                            </div>
                            <div className="editFormInputField mx-auto">
                                <TextField value={this.state.description} onChange={this.editFormInputFieldChange} id="description" className="fieldInnerDiv" label={`${modalCategory} Description`} type="text"/>
                            </div>
                            <div className="editFormInputField mx-auto">
                                <FormControl className="fieldInnerDiv">
                                    <InputLabel>{modalCategory} Status</InputLabel>
                                    <Select onChange={this.editFormSelectFieldChange} renderValue={() => capitalize(this.state.status)} value={this.state.status}>
                                        <MenuItem menuid="status" value="Open">Open</MenuItem>
                                        {modalCategory==="Project" ? (<MenuItem menuid="status" value="Complete">Complete</MenuItem>):(null)}
                                        {modalCategory==="Project" ? (<MenuItem menuid="status" value="Abandoned">Abandoned</MenuItem>):(null)}
                                        {modalCategory==="Ticket" ? (<MenuItem menuid="status" value="In Progress">In Progress</MenuItem>):(null)}
                                        {modalCategory==="Ticket" ? (<MenuItem menuid="status" value="Resolved">Resolved</MenuItem>):(null)}
                                        {modalCategory==="Ticket" ? (<MenuItem menuid="status" value="Additional Info Required">Additional Info Required</MenuItem>):(null)}
                                    </Select>
                                </FormControl>
                            </div>

                            {
                                modalCategory==="Ticket" ? 
                                (<div className="editFormInputField mx-auto">
                                    <FormControl className="fieldInnerDiv">
                                        <InputLabel>{modalCategory} Type</InputLabel>
                                        <Select onChange={this.editFormSelectFieldChange} renderValue={() => capitalize(this.state.type)} value={this.state.type}>
                                            <MenuItem menuid="type" value="Functional">Functional</MenuItem>
                                            <MenuItem menuid="type" value="Performance">Performance</MenuItem>
                                            <MenuItem menuid="type" value="Usability">Usability</MenuItem>
                                            <MenuItem menuid="type" value="Compatibility">Compatibility</MenuItem>
                                            <MenuItem menuid="type" value="Security">Security</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>) : (null)
                            }

                            {
                                modalCategory==="Ticket" ? 
                                (<div className="editFormInputField mx-auto">
                                    <FormControl className="fieldInnerDiv">
                                        <InputLabel>{modalCategory} Priority</InputLabel>
                                        <Select onChange={this.editFormSelectFieldChange} renderValue={() => capitalize(this.state.priority)} value={this.state.priority}>
                                            <MenuItem menuid="priority" value="High">High</MenuItem>
                                            <MenuItem menuid="priority" value="Medium">Medium</MenuItem>
                                            <MenuItem menuid="priority" value="Low">Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>) : (null)
                            }

                            { modalCategory==="Project" ?
                                (<div className="editFormInputField mx-auto">
                                    <FormControl className="fieldInnerDiv">
                                        <InputLabel>Project Developers</InputLabel>
                                        <Select multiple={modalCategory==="project" ? true : false} onChange={this.editFormSelectFieldChange} renderValue={() => this.state.developers.join(", ")} value={this.state.developers}>
                                            {
                                                this.state.allDevs.map((dev) => {
                                                    return <MenuItem menuid="developers" value={dev}>{dev}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>) :
                                (<div className="editFormInputField mx-auto">
                                    <FormControl className="fieldInnerDiv">
                                        <InputLabel>Assign a New Developer</InputLabel>
                                        <Select onChange={this.editFormSelectFieldChange} renderValue={() => this.state["developer assigned"]} value={this.state["developer assigned"]}>
                                            {
                                                this.state.allDevs.map((dev) => {
                                                    return <MenuItem menuid="developer assigned" value={dev}>{dev}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>)
                            }

                            { modalCategory==="Project" ? (<div className="editFormInputField mx-auto">
                                    <FormControl className="fieldInnerDiv">
                                        <InputLabel>Project Testers</InputLabel>
                                        <Select multiple onChange={this.editFormSelectFieldChange} renderValue={() => this.state.testers.join(", ")} value={this.state.testers}>
                                            {
                                                this.state.allTesters.map((tester) => {
                                                    return <MenuItem menuid="testers" value={tester}>{tester}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </div>) : (null)
                            }

                            { modalCategory==="Ticket" ? (<div className="editFormInputField mx-auto">
                                <TextField value={this.state.comment} onChange={this.editFormInputFieldChange} id="comment" className="fieldInnerDiv" label="Add A New Comment to the Ticket" type="text"/>
                            </div>) : (null)
                            }
                            
                            <div className="editformButtonfield mx-auto">
                                <Button onClick={this.handleEditFormButtonClick} buttonid="reset" size="large" variant="contained" color="primary"><strong>RESET</strong></Button>
                                <Button onClick={this.handleEditFormButtonClick} buttonid="submit" size="large" variant="contained" color="secondary"><strong>SUBMIT</strong></Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Editbox
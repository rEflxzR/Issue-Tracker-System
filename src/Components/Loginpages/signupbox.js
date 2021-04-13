import React, { Component } from 'react'
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/core/styles';
import './Signupbox.css'

const SignupButton = styled(Button)({
    background: 'linear-gradient(to right, #269c1e, #269c1e)'
})


class Signupbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: "",
            passwordconfirmation: "",
            role: "",
            passwordsMatch: false
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleRoleMenuChange = this.handleRoleMenuChange.bind(this)
        this.changePasswordConfStatus = this.changePasswordConfStatus.bind(this)
        this.handleSubmitClick = this.handleSubmitClick.bind(this)
    }

    handleInputChange(evt) {
        const { id, value } = evt.currentTarget
        this.setState({ [id]: value })
    }

    handleRoleMenuChange(evt) {
        this.setState({ role: evt.currentTarget.getAttribute("data-value") })
    }

    changePasswordConfStatus() {
        this.setState({ passwordsMatch: false })
    }

    async handleSubmitClick(evt) {
        evt.preventDefault()
        const form = evt.currentTarget.form
        if(form.reportValidity()) {
            const url = `http://${window.location.hostname}:3000/signup`
            let { username, email, password, role, passwordconfirmation } = this.state
            username = username.replace(" ", "")
            if(password===passwordconfirmation) {
                await axios.post(url, {username, email, password, role})
                .then((res) => {
                    this.setState({ username: "", email: "", password: "", passwordconfirmation: "", passwordsMatch: false, role: "" }, () => {
                        alert("Sign Up Complete, Proceed to Login")
                        this.props.redirect("home")
                    })
                })
                .catch((err) => {
                    this.setState({ username: "", email: "", password: "", passwordconfirmation: "", passwordsMatch: false, role: "" }, () => {
                        let message = ""
                        err.response.data.forEach((err) => {
                            message += `${err.msg}\n\n`
                        })
                        alert(message)
                    })
                })
            }
            else {
                this.setState({ passwordsMatch: true, password: "", passwordconfirmation: "" })
            }
        }
    }

    render() {
        return(
            <div className="signupform">
                <form>
                    <h2 className="boxtext-center">SIGN UP</h2>
                    <div className="signupinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.username} className="signupforminput" id="username" label="Enter a Username" type="text"/>
                    </div>
                    <div className="signupinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.email} className="signupforminput" id="email" label="Enter an Email Address" type="text" />
                    </div>
                    <div className="signupinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.password} className="signupforminput" id="password" label="Enter your Password" type="password" />
                    </div>
                    <div className="signupinputdiv">
                        <TextField required helperText={this.state.passwordsMatch ? 'Passwords do Not Match' : ''} error={this.state.passwordsMatch} onChange={this.handleInputChange} value={this.state.passwordconfirmation} onClick={this.changePasswordConfStatus} className="signupforminput" id="passwordconfirmation" label="Re-Enter your Password" type="password" />
                    </div>
                    <div className="signupinputdiv">
                        <FormControl required className="selectmenu">
                            <InputLabel id="demo-simple-select-label">Role</InputLabel>
                            <Select labelId="demo-simple-select-label" value={this.state.role} onChange={this.handleRoleMenuChange}>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="projectmanager">Project Manager</MenuItem>
                                <MenuItem value="developer">Developer</MenuItem>
                                <MenuItem value="tester">Tester</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="signupinputdiv signupbutton">
                        <SignupButton onClick={this.handleSubmitClick} size="large" variant="contained" color="primary">Sign Up</SignupButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default Signupbox
import React, { Component } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/core/styles';
import './Newpassword.css'

const ResetButton = styled(Button)({
    background: 'linear-gradient(to right, #269c1e, #269c1e)'
})


class Newpassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPassword: "",
            newPassword: "",
            passwordConfirmation: "",
            passwordsMatch: false
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmitClick = this.handleSubmitClick.bind(this)
        this.changePasswordConfStatus = this.changePasswordConfStatus.bind(this)
    }

    handleInputChange(evt) {
        const { id, value } = evt.currentTarget
        this.setState({ [id]: value })
    }

    changePasswordConfStatus() {
        this.setState({ passwordsMatch: false })
    }

    async handleSubmitClick(evt) {
        evt.preventDefault()
        const form = evt.currentTarget.form
        if(form.reportValidity()) {
            const url = `http://${window.location.hostname}:3000/newpassword`
            const { currentPassword, newPassword, passwordConfirmation } = this.state
            if(newPassword===passwordConfirmation) {
                await axios.post(url, { currentPassword, newPassword })
                .then((res) => {
                    this.setState({ currentPassword: "", newPassword: "", passwordConfirmation: "" }, () => {
                        alert("Your Password has been Reset Successfully")
                        this.props.redirect("home")
                    })
                })
                .catch((err) => {
                    this.setState({ currentPassword: "", newPassword: "", passwordConfirmation: "" }, () => {
                        alert("Error: Please Ensure You Entered Correct Password")
                    })
                })
            }
            else {
                this.setState({ newPassword: "", passwordConfirmation: "", passwordsMatch: true })
            }
        }
    }

    render() {
        return(
            <div className="passwordresetform">
                <form>
                    <h2 className="boxtext-center">SET NEW PASSWORD</h2>
                    <div className="passwordresetinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.currentPassword} className="signupforminput" id="currentPassword" label="Enter Your Current Password" type="password" />
                    </div>
                    <div className="passwordresetinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.newPassword} className="signupforminput" id="newPassword" label="Enter New Password" type="password" />
                    </div>
                    <div className="passwordresetinputdiv">
                        <TextField required helperText={this.state.passwordsMatch ? 'Passwords do Not Match' : ''} error={this.state.passwordsMatch} onChange={this.handleInputChange} value={this.state.passwordConfirmation} onClick={this.changePasswordConfStatus} className="signupforminput" id="passwordConfirmation" label="Re-Enter You New Password" type="password" />
                    </div>
                    <div className="passwordresetinputdiv passwordresetbutton">
                        <ResetButton onClick={this.handleSubmitClick} size="large" variant="contained" color="primary">RESET PASSWORD</ResetButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default Newpassword
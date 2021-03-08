import React, { Component } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Passwordreset.css'

class Passwordreset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmitClick = this.handleSubmitClick.bind(this)
    }

    handleInputChange(evt) {
        const { id, value } = evt.currentTarget
        this.setState({ [id]: value })
    }

    async handleSubmitClick(evt) {
        evt.preventDefault()
        const form = evt.currentTarget.form
        if(form.reportValidity()) {
            const url = `http://${window.location.hostname}:3000/passwordreset`
            const { email } = this.state
            await axios.post(url, { email })
            .then((res) => {
                this.setState({ email: "" })
                if(res.data==="Success") {
                    alert("Your Password has been Reset Successfully\nCheck your Email for the New Password")
                    this.props.setNewPass()
                }
                else {
                    throw new Error('Email Address is Invalid')
                }
            })
            .catch((err) => {
                alert(err)
            })
        }
    }

    render() {
        return(
            <div className="passwordresetform">
                <form>
                    <h2 className="boxtext-center">RESET PASSWORD</h2>
                    <div className="passwordresetinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.email} className="signupforminput" id="email" label="Enter your Email Address" type="text" />
                    </div>
                    <div className="passwordresetinputdiv passwordresetbutton">
                        <Button onClick={this.handleSubmitClick} size="large" variant="contained" color="primary">RESET PASSWORD</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Passwordreset
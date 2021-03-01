import React, { Component } from 'react'
import axios from 'axios'
import { Input } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Signupbox.css'

class Signupbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            email: "",
            password: "",
            passwordconf: ""
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
            const url = `http://${window.location.hostname}:8000/signup`
            const { username, email, password } = this.state
            await axios.post(url, {username, email, password})
            .then((res) => {
                console.log("Signup Request Sent Successfully")
            })
            .catch((err) => {
                console.log("Signup Request Encountered some Errror")
                console.log(err)
            })
        }
    }

    render() {
        return(
            <div className="signupform">
                <form>
                    <h2 className="boxtext-center">SIGN UP</h2>
                    <div className="signupinputdiv">
                        <TextField required={true} onChange={this.handleInputChange} value={this.state.username} className="signupforminput" id="username" label="Enter a Username" type="text"/>
                    </div>
                    <div className="signupinputdiv">
                        <TextField required={true} onChange={this.handleInputChange} value={this.state.email} className="signupforminput" id="email" label="Enter an Email Address" type="text" />
                    </div>
                    <div className="signupinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.password} className="signupforminput" id="password" label="Enter your Password" type="password" />
                    </div>
                    <div className="signupinputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.passwordconf} className="signupforminput" id="passwordconf" label="Re-Enter your Password" type="password" />
                    </div>
                    <div className="signupinputdiv signupbutton">
                        <Button onClick={this.handleSubmitClick} size="large" variant="contained" color="primary">Sign Up</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Signupbox
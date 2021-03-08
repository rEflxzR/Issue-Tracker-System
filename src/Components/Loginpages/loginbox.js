import React, { Component } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Loginbox.css'


class Loginbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
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
            const url = `http://${window.location.hostname}:3000/signin`
            const { username, password } = this.state
            await axios.post(url, { username, password }, {withCredentials: true})
            .then((res) => {
                this.setState({ username: "", password: "" })
                if(res.data==="Success") {
                    this.props.redirect("dashboard")
                }
                else {
                    console.log(res.data)
                    let message = ""
                    res.data.forEach((err) => {
                        message += `${err}\n\n`
                    })
                    throw new Error(message)
                }
            })
            .catch((err) => {
                alert(err)
            })
        }
    }

    render() {
        return (
            <div className="form">
                <form>
                    <h2 className="boxtext-center">LOGIN</h2>
                    <div className="inputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.username} className="forminput" id="username" label="Username" type="text" />
                    </div>
                    <div className="inputdiv">
                        <TextField required onChange={this.handleInputChange} value={this.state.password} className="forminput" id="password" label="Password" type="password" />
                    </div>
                    <div className="inputdiv loginbutton">
                        <Button onClick={this.handleSubmitClick} size="large" variant="contained" color="primary">Sign In</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Loginbox
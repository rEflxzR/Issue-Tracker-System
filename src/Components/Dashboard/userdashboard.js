import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../Navbars/navbar'
import './Userdashboard.css'

class Userdashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userAuthenticated: false
        }

        this.signOutUser = this.signOutUser.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/cookie-session`
        await axios.get(url, { withCredentials: true })
        .then((res) => {
            this.setState({ userAuthenticated: true })
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
            this.setState({ userAuthenticated: false })
            window.localStorage.clear()
            this.props.history.replace("/")
        })
    }

    async signOutUser() {
        const url = `https://${window.location.hostname}:3000/logout`
        await axios.get(url, {withCredentials: true})
        .then((res) => {
            this.setState({ userAuthenticated: false })
            window.localStorage.clear()
            this.props.history.replace("/")
        })
        .catch((err) => {
            console.log("Error Signing Out the User")
            console.log(err)
        })
    }

    render() {
        const { userAuthenticated } = this.state

        if(!userAuthenticated) {
            return null
        }

        return(
            <div>
                <Navbar logout={this.signOutUser} />
            </div>
        )
    }
}

export default Userdashboard
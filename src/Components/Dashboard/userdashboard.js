import React, { Component } from 'react'
import axios from 'axios'
import Navbar from '../Navbars/navbar'
import './Userdashboard.css'

class Userdashboard extends Component {
    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/cookie-session`
        await axios.get(url, { withCredentials: true })
        .then((res) => {
            console.log("User Authenticated")
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
            window.localStorage.clear()
            this.props.history.replace("/")
        })
    }

    render() {
        return(
            <div>
                <Navbar />
            </div>
        )
    }
}

export default Userdashboard
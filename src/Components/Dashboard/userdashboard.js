import React, { Component } from 'react'
import axios from 'axios'
import PersistentDrawerLeft from '../Navbars/drawerandnavbar'
import './Userdashboard.css'

class Userdashboard extends Component {
    async componentDidMount() {
        const url = `http://${window.location.hostname}:3000/cookie-session`
        await axios.get(url, { withCredentials: true })
        .then((res) => {
            if(res.data=="Fail") {
                this.props.history.replace("/")
            }
        })
        .catch((err) => {
            console.log("Request Sent to the Server Failed")
            this.props.history.replace("/")
        })
    }

    render() {
        return(
            <div>
                <PersistentDrawerLeft />
            </div>
        )
    }
}

export default Userdashboard
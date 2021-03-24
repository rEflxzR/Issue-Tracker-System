import React, { Component } from 'react'
import axios from 'axios'

class UserProjects extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minProjectsData: [],
            detailedProjectsData: []
        }
    }

    async componentDidMount() {
        console.log("Sending Request to the Backend")
        const url = `http://${window.location.hostname}:8000/userprojects`
        const username = window.localStorage.getItem("Name")
        await axios.get(url, {headers: {username}}, {withCredentials: true})
        .then((res) => {
            console.log("Request Sent to the Server Successfully")
            const brief = []
            // res.data.forEach((project) => {
            //     const { title,  }
            // })
        })
        .catch((err) => {
            console.log("Could Not Send a Request to the Server")
        })
    }

    render() {
        return(
            <div>
                <h1 className="h1 text-light">THIS IS THE USER PROJECTS PAGE</h1>
            </div>
        )
    }
}

export default UserProjects
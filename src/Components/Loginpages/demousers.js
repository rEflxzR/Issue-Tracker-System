import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import admin from '../../Images/admin.jpg'
import manager from '../../Images/manager.jpg'
import developer from '../../Images/developer.jpg'
import tester from '../../Images/tester.jpg'
import './demousers.css'

class Demousers extends Component {
    constructor(props) {
        super(props)

        this.handleLinkClick = this.handleLinkClick.bind(this)
    }

    async handleLinkClick(evt) {
        evt.preventDefault()
        const role = evt.currentTarget.getAttribute("role")
        const url = `https://${window.location.hostname}/demosignin`

        await axios.post((url), {role})
        .then((res) => {
            window.localStorage.clear()
            window.localStorage.setItem("Name", res.data.content.Name)
            window.localStorage.setItem("Role", res.data.content.Role)
            this.props.redirect("dashboard")
        })
        .catch((err) => {
            console.log("Some Error Occurred")
            console.log(err)
        })
    }

    render() {
        return (
            <div className="demologinform">
                <div id="test" className="row iconrow">
                    <div className="col col-6" style={{ borderRight: 'solid black 1px', borderBottom: 'solid black 1px' }}>
                        <Link role="admin" onClick={this.handleLinkClick}>
                            <img className="tabicon" src={admin} alt="admin icon" />
                            <h3 className="text-center my-0"><strong>ADMIN</strong></h3>
                        </Link>
                    </div>
                    <div className="col col-6" style={{ borderLeft: 'solid black 1px', borderBottom: 'solid black 1px' }}>
                        <Link role="projectmanager" onClick={this.handleLinkClick}>
                            <img className="tabicon" src={manager} alt="admin icon" />
                            <h3 className="text-center my-0"><strong>MANAGER</strong></h3>
                        </Link>
                    </div>
                </div>
                <div className="row iconrow">
                    <div className="col col-6" style={{ borderTop: 'solid black 1px', borderRight: 'solid black 1px' }}>
                        <Link role="developer" onClick={this.handleLinkClick}>
                            <img className="tabicon" src={developer} alt="admin icon" />
                            <h3 className="text-center my-0"><strong>DEVELOPER</strong></h3>
                        </Link>
                    </div>
                    <div className="col col-6" style={{ borderTop: 'solid black 1px', borderLeft: 'solid black 1px' }}>
                        <Link role="tester" onClick={this.handleLinkClick}>
                            <img className="tabicon" src={tester} alt="admin icon" />
                            <h3 className="text-center my-0"><strong>TESTER</strong></h3>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Demousers
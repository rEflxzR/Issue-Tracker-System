import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Loginbox.css'


class Loginbox extends Component {
    render() {
        return (
            <div className="form">
                <form>
                    <h2 className="boxtext-center">LOGIN</h2>
                    <div className="inputdiv">
                        <TextField className="forminput" id="standard-basic" label="Username" type="text" />
                    </div>
                    <div className="inputdiv">
                        <TextField className="forminput" id="standard-basic" label="Password" type="password" />
                    </div>
                    <div className="inputdiv loginbutton">
                        <Button size="large" variant="contained" color="primary">Sign In</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Loginbox
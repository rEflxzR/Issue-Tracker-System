import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Signupbox.css'

class Signupbox extends Component {
    render() {
        return(
            <div className="signupform">
                <form>
                    <h2 className="boxtext-center">SIGN UP</h2>
                    <div className="signupinputdiv">
                        <TextField className="signupforminput" id="standard-basic" label="Enter a Username" type="text"/>
                    </div>
                    <div className="signupinputdiv">
                        <TextField className="signupforminput" id="standard-basic" label="Enter an Email Address" type="text" />
                    </div>
                    <div className="signupinputdiv">
                        <TextField className="signupforminput" id="standard-basic" label="Enter your Password" type="password" />
                    </div>
                    <div className="signupinputdiv">
                        <TextField className="signupforminput" id="standard-basic" label="Re-Enter your Password" type="password" />
                    </div>
                    <div className="signupinputdiv signupbutton">
                        <Button size="large" variant="contained" color="primary">Sign Up</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Signupbox
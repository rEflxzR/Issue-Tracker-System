import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Passwordreset.css'

class Passwordreset extends Component {
    render() {
        return(
            <div className="passwordresetform">
                <form>
                    <h2 className="boxtext-center">RESET PASSWORD</h2>
                    <div className="passwordresetinputdiv">
                        <TextField className="signupforminput" id="standard-basic" label="Enter your Email Address" type="text" />
                    </div>
                    <div className="passwordresetinputdiv passwordresetbutton">
                        <Button size="large" variant="contained" color="primary">RESET PASSWORD</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Passwordreset
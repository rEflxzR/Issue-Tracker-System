import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import './Loginpage.css'

class Loginpage extends Component {
  render() {
		return (
			<div className="main">
				<div className="loginbox">
					{/* <h1 className="text-center">BUG TRACKER</h1> */}
					<div className="form">
						<form>
							<h1 className="text-center">ISSUE TRACKER LOGIN</h1>
							<div className="inputdiv">
								<TextField className="forminput" id="standard-basic" label="Email" type="text" />
							</div>
							<div className="inputdiv">
								<TextField className="forminput" id="standard-basic" label="Password" type="password" />
							</div>
							<div className="inputdiv loginbutton">
								<Button size="large" variant="contained" color="primary">Sign In</Button>
							</div>
						</form>
					</div>
				</div>
				<div className="photobox">
				</div>
			</div>
    )
  }
}

export default Loginpage
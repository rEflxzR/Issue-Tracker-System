import React, { Component } from 'react'
import Loginbox from '../Loginpages/loginbox'
import Signupbox from '../Loginpages/signupbox'
import Link from '@material-ui/core/Link'
import './Landingpage.css'

class Landingpage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentbox: 'signup'  // choose from login, signup, resetpassword, demouser
		}

		this.linkClickHandler = this.linkClickHandler.bind(this)
	}

	linkClickHandler(evt) {
		evt.preventDefault()
		console.log(evt.currentTarget.value)
	}

  	render() {
		return (
			<div className="main">
				<div className="loginbox">
					<h1 className="text-center" id="heading">BUG TRACKER</h1>
					<div className="renderbox">
					{this.state.currentbox==='login' && <Loginbox />}
					{this.state.currentbox==='signup' && <Signupbox />}
					{this.state.currentbox==='resetpassword' && <Loginbox />}
					{this.state.currentbox==='demouser' && <Loginbox />}
					</div>

					<div className="auxbuttons">
						<Link href="#" value="signup" onClick={this.linkClickHandler}>Create A New Account</Link>
                    </div>

					{/* THESE TWO BUTTONS ARE ALWAYS PRESENT*/}
					<div id="reset" className="auxbuttons">
						<Link href="#" value="resetpassword" onClick={this.linkClickHandler}>Forgot Password ?</Link>
                    </div>
					<div id="demo" className="auxbuttons">
						<Link href="#" value="demouser" onClick={this.linkClickHandler}>Sign In as Demo User</Link>
                    </div>
				</div>
				<div className="photobox">
				</div>
			</div>
    	)
  	}
}

export default Landingpage
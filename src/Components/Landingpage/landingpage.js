import React, { Component } from 'react'
import Loginbox from '../Loginpages/loginbox'
import Signupbox from '../Loginpages/signupbox'
import Passwordreset from '../Loginpages/passwordreset'
import Link from '@material-ui/core/Link'
import './Landingpage.css'

class Landingpage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentbox: 'login'  // choose from login, signup, resetpassword, demouser
		}

		this.linkClickHandler = this.linkClickHandler.bind(this)
	}

	linkClickHandler(evt) {
		evt.preventDefault()
		if(evt.currentTarget.text[0]==='L') {
			this.setState({ currentbox: 'login' })
		}
		else if(evt.currentTarget.text[0]==='C') {
			this.setState({ currentbox: 'signup' })
		}
		else if(evt.currentTarget.text[0]==='F') {
			this.setState({ currentbox: 'resetpassword' })
		}
		else {
			this.setState({ currentbox: 'demouser' })
		}
	}

  	render() {
		return (
			<div className="main">
				<div className="loginbox">
					<h1 className="text-center" id="heading">BUG TRACKER</h1>
					<div className="renderbox">
						{this.state.currentbox==='login' && <Loginbox />}
						{this.state.currentbox==='signup' && <Signupbox />}
						{this.state.currentbox==='resetpassword' && <Passwordreset />}
						{this.state.currentbox==='demouser' && <Loginbox />}
					</div>

					{ this.state.currentbox!=='login' &&
						<div className="auxbuttons">
							<Link href="#" value="signup" onClick={this.linkClickHandler}>Login Using Existing Account</Link>
						</div>
					}
					{ this.state.currentbox!=='signup' &&
						<div className="auxbuttons">
							<Link href="#" value="signup" onClick={this.linkClickHandler}>Create A New Account</Link>
						</div>
					}
					{ this.state.currentbox!=='resetpassword' &&
						<div className="auxbuttons">
							<Link href="#" value="resetpassword" onClick={this.linkClickHandler}>Forgot Password ?</Link>
						</div>
					}
					{ this.state.currentbox!=='demouser' &&
						<div className="auxbuttons">
							<Link href="#" value="demouser" onClick={this.linkClickHandler}>Sign In as Demo User</Link>
						</div>
					}
				</div>
				<div className="photobox">
				</div>
			</div>
    	)
  	}
}

export default Landingpage
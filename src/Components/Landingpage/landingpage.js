import React, { Component } from 'react'
import Loginbox from '../Loginpages/loginbox'
import Signupbox from '../Loginpages/signupbox'
import Passwordreset from '../Loginpages/passwordreset'
import Newpassword from '../Loginpages/newpassword'
import Demousers from '../Loginpages/demousers'
import Link from '@material-ui/core/Link'
import './Landingpage.css'

class Landingpage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentbox: 'login'  // choose from login, signup, resetpassword, setnewpassword, demouser
		}

		this.linkClickHandler = this.linkClickHandler.bind(this)
		this.handleRedirect = this.handleRedirect.bind(this)
		this.setNewPassword = this.setNewPassword.bind(this)
	}

	componentDidMount() {
		window.localStorage.clear()
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

	setNewPassword() {
		this.setState({ currentbox: 'setnewpassword' })
	}

	handleRedirect(page) {
		if(page==="home") {
			window.location.reload()
		}
		else if(page==="dashboard") {
			this.props.history.push("/dashboard")
		}
	}

  	render() {
		return (
			<div className="main">
				<div className="loginbox">
					<h1 className="text-center" id="heading">BUG TRACKER</h1>
					<div className="renderbox">
						{this.state.currentbox==='login' && <Loginbox redirect={this.handleRedirect} />}
						{this.state.currentbox==='signup' && <Signupbox redirect={this.handleRedirect} />}
						{this.state.currentbox==='resetpassword' && <Passwordreset setNewPass={this.setNewPassword} />}
						{this.state.currentbox==='setnewpassword' && <Newpassword redirect={this.handleRedirect} />}
						{this.state.currentbox==='demouser' && <Demousers redirect={this.handleRedirect} />}
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
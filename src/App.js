import React, { Component } from 'react'
import axios from 'axios'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landingpage from './Components/Landingpage/landingpage'
import Userdashboard from './Components/Dashboard/userdashboard'
import './App.css'


class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoggedIn: false
		}
	}

	// async componentDidMount() {
	// 	const url = `http://${window.location.hostname}:3000/cookie-session`
	// 	const result = await axios.get(url, {withCredentials: true})
	// 	if(result.data=="Success") {
	// 		this.setState({ isLoggedIn: true })
	// 	}
	// 	this.setState({ isLoggedIn: false })
	// }

	render() {
		return (
			<div className="landingpage">
				<Switch>
					<Route exact path="/" component={Landingpage} />
					<Route exact path="/dashboard" render={(routeProps) => {
						return <Userdashboard {...routeProps} />
					}} />
					{/* <Route exact path="/dashboard" render={(routeProps) => {
						console.log(routeProps)
						return this.state.isLoggedIn ? <Userdashboard {...routeProps} />
						:
						<Redirect path="/" />
					}} /> */}
				</Switch>
			</div>
		)
	}
}

export default App;
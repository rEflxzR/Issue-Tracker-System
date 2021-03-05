import React, { Component } from 'react'
import axios from 'axios'
import { Redirect, Route, Switch } from 'react-router-dom'
import Landingpage from './Components/Landingpage/landingpage'
import Userdashboard from './Components/Dashboard/userdashboard'
// import UserAuthentication from './Components/Authentication/auth'
import './App.css'

class App extends Component {
	render() {
		return (
			<div className="landingpage">
				<Switch>
					<Route exact path="/" component={Landingpage} />
					<Route exact path="/dashboard" component={async () => {
						const url = `http://${window.location.hostname}:3000/cookie-session`
						const result = await axios.get(url, {withCredentials: true})
						if(result.data=="Success") {
							return <Userdashboard />
						}
						else {
							return <Redirect path="/" />
						}
						// result.data=="Success" ? (
						// 	<Userdashboard />
						// ) : (
						// 	<Redirect path="/" />
						// )
					}} />
				</Switch>
				{/* <Userdashboard /> */}
			</div>
		)
	}
}

export default App;
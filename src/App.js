import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Landingpage from './Components/Landingpage/landingpage'
import Userdashboard from './Components/Dashboard/userdashboard'
import ManageUsers from './Components/Dashboardcomponents/manageusers'
import './App.css'


class App extends Component {
	render() {
		return (
			<div className="landingpage">
				<Userdashboard />
				<Switch>

					{/* <Route exact path="/" component={Landingpage} /> */}
					{/* <Route exact path="/dashboard/users" component={ManageUsers} /> */}

					{/*PRIVATE ROUTE ONLY ACCESSIBLE AFTER AUTHENTICATION*/}
					{/* <Route exact path="/dashboard" render={(routeProps) => {
						return <Userdashboard {...routeProps} />
					}} /> */}
				</Switch>
			</div>
		)
	}
}

export default App;
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Landingpage from './Components/Landingpage/landingpage'
import Userdashboard from './Components/Dashboard/userdashboard'
import './App.css'


class App extends Component {
	render() {
		return (
			<div className="landingpage">
				<Switch>
					<Route exact path="/" component={Landingpage} />

					{/*PRIVATE ROUTE ONLY ACCESSIBLE AFTER AUTHENTICATION*/}
					<Route exact path="/dashboard" render={(routeProps) => {
						return <Userdashboard {...routeProps} />
					}} />
				</Switch>
			</div>
		)
	}
}

export default App;
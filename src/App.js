import React, { Component } from 'react'
import './App.css'
import Landingpage from './Components/Landingpage/landingpage'
import Userdashboard from './Components/Dashboard/userdashboard'

class App extends Component {
	render() {
		return (
			<div className="landingpage">
				<Landingpage />
			</div>
			// <div>
			// 	<Userdashboard />
			// </div>
		)
	}
}

export default App;
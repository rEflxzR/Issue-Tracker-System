import React, { Component } from 'react'
import Box from '../Auxcomponents/genericbox'

class Homepage extends Component {
    render() {
        return (
            <div className="d-flex justify-content-center">
                <div style={{ width: '80vw' }}>
                    <div className="row d-flex justify-content-between px-5 mx-5" style={{ height: '50vh' }}>
                        {/* <div className="col col-5 px-0">
                            <Box />
                        </div>
                        <div className="col col-5 px-0">
                            <Box />
                        </div> */}
                    </div>
                    {/* <div className="row d-flex justify-content-between px-5 mx-5">
                        <div className="col col-5 px-0">
                            <Box />
                        </div>
                        <div className="col col-5 px-0">
                            <Box />
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default Homepage
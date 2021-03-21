import React, { Component } from 'react'
import Modal from '../Auxcomponents/modal'

class Homepage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }

        this.displayModal = this.displayModal.bind(this)
    }

    displayModal() {
        this.setState(currState => ({
            showModal: !currState.showModal
        }))
    }


    render() {
        return (
            <div className="d-flex justify-content-center">
                <div className="row" style={{ width: '80vw', height: '75vh' }}>
                    <div className="mod">
                        <button onClick={this.displayModal} className="btn btn-lg btn-success">TOGGLE MODAL</button>

                        <Modal display={this.state.showModal} toggleDisplay={this.displayModal}
                        />

                    </div>
                </div>
            </div>
        )
    }
}

export default Homepage
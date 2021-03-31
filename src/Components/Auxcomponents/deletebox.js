import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import './deletebox.css'
import axios from 'axios'

class Deletebox extends Component {
    constructor(props) {
        super(props)

        this.handleConfirmButtonClick = this.handleConfirmButtonClick.bind(this)
    }

    async handleConfirmButtonClick() {
        const url = `http://${window.location.hostname}:8000/deleteproject`
        const {title} = this.props
        await axios.delete(url, {data: {title}})
        .then((res) => {
            this.props.closeModal("closeModal")
        })
        .catch((err) => {
            alert("Some Error Occurred", ()=> {
                this.props.closeModal("closeModal")
            })
        })
    }

    render() {
        return(
            <div className="deletebox">
                <div className="deletebox-header">
                    <div>
                        <h1 className="text-center h1 my-0"><strong>WARNING!!!</strong></h1>
                    </div>
                </div>
                <div className="deletebox-footer">
                    <div className="deleteModal-Content">
                        <div>
                            <h3 className="mb-2">Are You Sure to Delete This <span className="text-capitalize">{this.props.type}</span></h3>
                            <h4 className="text-capitalize mb-4"><strong><em>{this.props.title}</em></strong></h4>
                            <Button onClick={this.handleConfirmButtonClick} buttonId="confirm" size="large" variant="contained" color="secondary"><strong>CONFIRM</strong></Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Deletebox
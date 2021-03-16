import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import './genericbox.css'

class Box extends Component {
    constructor(props) {
        super(props)

        this.handlePageButtonClick = this.handlePageButtonClick.bind(this)
    }

    handlePageButtonClick(evt) {
        this.props.togglePage(Number(evt.currentTarget.innerText))
    }

    render() {
        const num = this.props.page
        const length = this.props.totalEntries
        return(
            <div className="box">
                <div className="header">
                    <div>
                        <h1 className="text-light text-center">{this.props.title}</h1>
                    </div>
                </div>
                <div className="body">
                    <div className="tablecontainer">
                        <div className="tablediv px-5">
                            <table>
                                <thead>
                                    <tr className="tablehead row mx-0 my-2">
                                        <th className="h2 text-left col col-3 mx-0 my-0 px-0"><strong>NAME</strong></th>
                                        <th className="h2 text-left col col-6 mx-0 my-0 px-0"><strong>EMAIL</strong></th>
                                        <th className="h2 text-left col col-3 mx-0 my-0 px-0"><strong>ROLE</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.users.map((user) => {
                                            return <tr className="tablerow row mx-0 px-1" key={user.username}>
                                                    <td className="h5 text-left text-capitalize col col-3 mx-0 px-0">{user.username}</td>
                                                    <td className="h5 text-left col col-6 mx-0 px-0">{user.email}</td>
                                                    <td className="h5 text-left col text-capitalize col-3 mx-0 px-0">{user.role}</td>
                                                </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom px-5 my-2">
                        <h5 className="my-auto"><strong>Showing {num*10-10+1}-{num*10>length ? length : num*10} of {length} Entries</strong></h5>
                        <div>
                            {
                                [...Array(Math.ceil(length/10))].map((e, index) => {
                                    return <Button className="mx-2" onClick={this.handlePageButtonClick} size="large" variant="contained" color="secondary"><strong>{index+1}</strong></Button>
                                })
                            }
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Box
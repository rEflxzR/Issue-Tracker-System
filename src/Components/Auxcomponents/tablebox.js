import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import './tablebox.css'

class Box extends Component {
    constructor(props) {
        super(props)

        this.handlePageButtonClick = this.handlePageButtonClick.bind(this)
        this.handleBoxButtonClick = this.handleBoxButtonClick.bind(this)
    }

    handlePageButtonClick(evt) {
        this.props.togglePage(Number(evt.currentTarget.innerText))
    }

    handleBoxButtonClick(evt) {
        this.props.detailsModal(evt.currentTarget.getAttribute("value"))
    }

    render() {
        const num = this.props.page
        const length = this.props.totalEntries
        return(
            <div className="box">
                <div className="header">
                    <div>
                        <h1 className="text-light text-center"><strong>{this.props.title}</strong></h1>
                    </div>
                </div>
                <div className="body">
                    <div className="tablecontainer">
                        <div className="tablediv px-5">
                            <table>
                                <thead>
                                    <tr className="tablehead row mx-0 my-2">
                                        {
                                            this.props.heading.map((head, index) => {
                                                return <th key={index} className={`h2 text-left col col-${this.props.width[index]} mx-0 my-0 px-0`}><strong>{head.title}</strong></th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.body.map((entity, index) => {
                                            return <tr className="tablerow row mx-0 px-1 my-2" key={index}>
                                                {
                                                    Object.keys(entity).map((e, index) => {
                                                        return <td key={index} className={`rowtext h5 pr-2 text-left ${index%2===0 ? 'text-capitalize' : null} col col-${this.props.width[index]} mx-0 px-0`}>{entity[e]}</td>
                                                    })
                                                }
                                                {
                                                    this.props.showButtons ? <Button key={index} value={entity[this.props.buttonUUID]} className="text-light" onClick={this.handleBoxButtonClick} size="small" variant="contained" style={{ backgroundColor: '#1fab00' }}><strong>{this.props.buttonText}</strong></Button> : null
                                                }
                                                </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom px-5 my-2">
                        <h5 className="my-auto"><strong>Showing {length===0 ? 0 : num*10-10+1}-{num*10>length ? length : num*10} of {length} Entries</strong></h5>
                        <div>
                            {
                                [...Array(Math.ceil(length/10))].map((e, index) => {
                                    return <Button key={index} className="mx-2" onClick={this.handlePageButtonClick} size="large" variant="contained" color="secondary"><strong>{index+1}</strong></Button>
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
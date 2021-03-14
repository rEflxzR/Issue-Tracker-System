import React, { Component } from 'react'
import './genericbox.css'

class Box extends Component {
    static defaultProps = {
        title: "All Users",
        users: [{username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}, {username: "ReflxzR", email: "anshu.singh1429@gmail.com", role: "Developer"}]
    }

    render() {
        return(
            <div className="box">
                <div className="header">
                    <div>
                        <h1 className="text-light text-center">{this.props.title}</h1>
                    </div>
                </div>
                <div className="body">
                    <div>
                        <div className="tablediv">
                            <table>
                                <div className="tablehead row">
                                    <thead className="h2 text-center col col-3 mx-0 px-0"><strong>NAME</strong></thead>
                                    <thead className="h2 text-center col col-6 mx-0 px-0"><strong>EMAIL</strong></thead>
                                    <thead className="h2 text-center col col-3 mx-0 px-0"><strong>ROLE</strong></thead>
                                </div>
                                {
                                    this.props.users.map((user) => {
                                        return <div className="tablerow row">
                                                <tr className="h5 text-center text-capitalize col col-3 mx-0 px-0">{user.username}</tr>
                                                <tr className="h5 text-center col col-6 mx-0 px-0">{user.email}</tr>
                                                <tr className="h5 text-center col text-capitalize col-3 mx-0 px-0">{user.role}</tr>
                                            </div>
                                    })
                                }
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Box
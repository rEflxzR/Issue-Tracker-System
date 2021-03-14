import React, { Component } from 'react'
import axios from 'axios'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Box from '../Auxcomponents/genericbox'

class ManageUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: [],
            names: ["ReflxzR", "ReflxzR", "ReflxzR", "ReflxzR"],
            personName: ""
        }

        this.handleChangeMultiple = this.handleChangeMultiple.bind(this)
    }

    async componentDidMount() {
        const url = `http://${window.location.hostname}:8000/users`
        await axios.get(url)
        .then((res) => {
            console.log(res.data)
            this.setState({ userData: res.data })
        })
        .catch((err) => {
            console.log(err)
            console.log("Request Failed")
        })
    }

    handleChangeMultiple() {

    }

    render() {
        return(
            <div>
                <div className="row" style={{ height: '70vh', width: '80vw' }}>
                    <div className="col col-4">
                        {/* <FormControl>
                        <InputLabel shrink htmlFor="select-multiple-native">
                            Native
                            </InputLabel>
                            <Select
                            multiple
                            native
                            value={this.state.personName}
                            onChange={this.handleChangeMultiple}
                            inputProps={{
                                id: 'select-multiple-native',
                            }}
                            >
                            {this.state.names.map((name) => (
                                <option key={name} value={name}>
                                {name}
                                </option>
                            ))}
                            </Select>
                        </FormControl> */}
                    </div>
                    <div className="col col-8">
                        <Box users={this.state.userData} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ManageUsers
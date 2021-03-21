const mongoose = require("mongoose")

const Schema = mongoose.Schema
const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateOpened: {
        type: String,
        required: true
    },
    manager: {
        type: String,
        required: true
    },
    developers: {
        type: Array,
        required: true
    },
    testers: {
        type: Array,
        required: true
    },
    tickets: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: "open"
    },
})

module.exports = mongoose.model('Project', projectSchema)
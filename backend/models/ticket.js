const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectName: {
        type: String,
        required: true
    },
    dateOpened: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    tester: {
        type: String,
        required: true
    },
    developer: {
        type: String,
        default: ""
    },
    comments: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: "open"
    },
})

module.exports = mongoose.model('Ticket', ticketSchema)
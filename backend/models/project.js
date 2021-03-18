const mongoose = require("mongoose")

const Schema = mongoose.Schema
const projectSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: true,
        required: true
    },
    projectmanager: {
        type: String,
        required: true
    },
    developers: {
        type: Array,
        required: true
    },
    testers: {
        type: Array,
        require: true
    },
    tickets: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Project', projectSchema)
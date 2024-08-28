const mongoose = require('mongoose')

const settingSchema = mongoose.Schema({
    webName: {
        type: String,
        require: true
    },

    webDescription: {
        type: String,
        require: true
    },

    webKeywords: {
        type: String,
        require: true
    },
    whatsappNumber: {
        type: Number,
        require: true
    },
    otherNumber: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        require: true
    },
    facebook: {
        type: String,
        require: true
    },
    X: {
        type: String,
        require: true
    },
    LinkedIn: {
        type: String,
        require: true
    },
    Instagram: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model("Settings", settingSchema)
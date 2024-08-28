const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    creadeDateTime: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Message", messageSchema)
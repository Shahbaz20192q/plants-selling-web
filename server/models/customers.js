const mongoose = require('mongoose')

const customersSchema = mongoose.Schema({

    customer: {
        type: String,
        required: true,
        unique: true
    },
    creadeDateTime: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Customers", customersSchema)
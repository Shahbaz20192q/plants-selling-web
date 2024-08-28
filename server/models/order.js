const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productImage: {
        type: Array,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    countery: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    quantity: {
        type: Number,
        required: true
    },
    creadeDateTime: {
        type: Date,
        default: Date.now
    },
    paymob_order_id: {
        type: Number
    },
    payment_status: {
        type: String
    }
});


module.exports = mongoose.model("Order", orderSchema)
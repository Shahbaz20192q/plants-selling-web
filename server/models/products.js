const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    pageTitle: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },
    price: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productmetaDescription: {
        type: String,
        required: true
    },
    metaKeywords: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    creadeDateTime: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Products", productSchema)
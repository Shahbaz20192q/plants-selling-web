const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    pageTitle: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    categorymetaDescription: {
        type: String,
        required: true
    },
    categoryDescription: {
        type: String,
        required: true
    },
    metaKeywords: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
    creadeDateTime: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Category", categorySchema)
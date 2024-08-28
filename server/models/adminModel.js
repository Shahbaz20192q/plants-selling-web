const mongoose = require('mongoose')
const plm = require('passport-local-mongoose');
const mongodb = require('../config/db')

mongodb()
const adminSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: String,
});

adminSchema.plugin(plm);

module.exports = mongoose.model("Admin", adminSchema)
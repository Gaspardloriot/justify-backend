const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userData = new Schema({
    email: {
        type: String,
        required: true
    },
    characters: {
        type: Number,
        required: true
    },
    timer: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const JustifyUser = mongoose.model('JustifyUser', userData);
module.exports = JustifyUser;
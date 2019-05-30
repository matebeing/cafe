const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },

    avatar: {
        type: String,
        default: "",
        required: false,
    },

    colorName: {
        type: String,
        default: "",
        required: false,
    }
})

module.exports = mongoose.model('User', userSchema);
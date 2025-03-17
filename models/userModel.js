const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "please add username"]
        },
        email: {
            type: String,
            required: [true, "pleae add the email address"],
            unique: [true, "email address already used"]
        },
        password: {
            type: String,
            required: [true, "Please add user password"]
        },
    },
    {
        timestamp: true,
    }
)

module.exports = mongoose.model('User', userSchema);
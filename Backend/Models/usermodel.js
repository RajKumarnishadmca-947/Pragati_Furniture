const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    phone: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    pin: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "user"
    },

    // 🔥 OTP Fields
    otp: String,
    otpExpire: Date,

    resetOtp: String,
    resetOtpExpire: Date,

    isVerified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("users", userSchema)
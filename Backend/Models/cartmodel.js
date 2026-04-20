const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  pid: String,
  uid: String,
  title: String,
  price: Number,
  img: String,
  qty: {
    type: Number,
    default: 1
  }
}, { timestamps: true })

module.exports = mongoose.model("Cart", cartSchema)
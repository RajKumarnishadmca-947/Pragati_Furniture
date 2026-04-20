const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },

  items: [
    {
      pid: String,
      title: String,
      price: Number,
      qty: Number,
      img: String
    }
  ],

  totalAmount: Number,

  //Single correct status field
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }

}, { timestamps: true }) 

module.exports = mongoose.model("Orders", orderSchema)
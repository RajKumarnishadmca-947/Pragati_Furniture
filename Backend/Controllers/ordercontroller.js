const Order = require("../Models/ordermodel")
const Cart = require("../Models/cartmodel")
const User = require("../Models/usermodel")

// ✅ Nodemailer
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// ✅ Check mail server
transporter.verify((err, success) => {

  if (err) {
    console.log("MAIL CONFIG ERROR:", err)
  } else {
    console.log("MAIL SERVER READY ✅")
  }

})

// ✅ Place Order
exports.placeOrder = async (req, res) => {

  try {

    const { userId } = req.body

    console.log("USER ID:", userId)

    // ✅ Get user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      })
    }

    // ✅ Get cart items
    const cartItems = await Cart.find({
      uid: userId.toString()
    })

    console.log("CART:", cartItems)

    if (cartItems.length === 0) {
      return res.status(400).json({
        msg: "Cart is empty"
      })
    }

    // ✅ Calculate total
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )

    // ✅ Proper item structure
    const formattedItems = cartItems.map(item => ({
      pid: item.pid,
      title: item.title,
      price: item.price,
      qty: item.qty,
      img: item.img
    }))

    // ✅ Create order
    const newOrder = new Order({

      userId: userId.toString(),

      userName: user.name,

      userEmail: user.email,

      userPhone: user.phone,

      items: formattedItems,

      totalAmount: total
    })

    // ✅ Save order
    await newOrder.save()

    console.log("ORDER SAVED ✅")

    // ✅ Clear cart FIRST
    await Cart.deleteMany({
      uid: userId.toString()
    })

    console.log("CART CLEARED ✅")

    // ✅ Send response immediately
    res.status(200).json({
      msg: "Order placed successfully"
    })

    // ✅ Send email in background
try {

  const info = await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: user.email,

    subject: "Order Confirmation - SP Furniture",

    html: `
      <h2>Hello ${user.name}</h2>

      <p>Your order has been placed successfully 🛒</p>

      <p><b>Total Amount:</b> ₹ ${total}</p>

      <p>Thank you for shopping with us ❤️</p>
    `
  })

  console.log("MAIL SENT ✅")
  console.log(info)

  res.status(200).json({
    msg: "Order placed successfully"
  })

} catch (mailErr) {

  console.log("MAIL FAILED ❌")

  console.log(mailErr)

  res.status(500).json({
    msg: "Mail not sent"
  })
}

  } catch (err) {

    console.log("FULL ORDER ERROR ❌")

    console.log(err)

    res.status(500).json({
      msg: err.message
    })
  }
}

// ✅ Get User Orders
exports.getUserOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      userId: req.params.uid
    }).sort({ createdAt: -1 })

    res.json(orders)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      msg: "Error fetching orders"
    })
  }
}

// ✅ Get All Orders
exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 })

    res.json(orders)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      msg: "Error fetching all orders"
    })
  }
}

// ✅ Update Status
exports.updateStatus = async (req, res) => {

  try {

    const { status } = req.body

    await Order.findByIdAndUpdate(
      req.params.id,
      { status }
    )

    res.json({
      msg: "Status updated"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      msg: "Error updating status"
    })
  }
}

// ✅ Cancel Order
exports.cancelOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        msg: "Order not found"
      })
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        msg: "Cannot cancel this order"
      })
    }

    order.status = "Cancelled"

    await order.save()

    res.json({
      msg: "Order cancelled"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      msg: "Error cancelling order"
    })
  }
}

// ✅ Remove Item
exports.removeOrderItem = async (req, res) => {

  try {

    const { index } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        msg: "Order not found"
      })
    }

    if (
      index === undefined ||
      index < 0 ||
      index >= order.items.length
    ) {
      return res.status(400).json({
        msg: "Invalid index"
      })
    }

    // ✅ Remove item
    order.items.splice(index, 1)

    // ✅ Delete order if empty
    if (order.items.length === 0) {

      await Order.findByIdAndDelete(req.params.id)

      return res.json({
        msg: "Order deleted completely"
      })
    }

    // ✅ Recalculate total
    order.totalAmount = order.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )

    await order.save()

    res.json({
      msg: "Item removed",
      order
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      msg: "Error removing item"
    })
  }
}
const Order = require("../Models/ordermodel")
const Cart = require("../Models/cartmodel")

// ✅ Place Order
const User = require("../Models/usermodel")

exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId) // ✅ fetch user

    const cartItems = await Cart.find({ uid: userId })

    if (cartItems.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" })
    }

    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty, 0
    )

    const newOrder = new Order({
      userId,
      userEmail: user.email,
      userPhone: user.phone, 
      userName: user.name,
      items: cartItems,
      totalAmount: total
    })

    await newOrder.save()

    await Cart.deleteMany({ uid: userId })

    res.json({ msg: "Order placed successfully" })

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Order failed" })
  }
}

// ✅ Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.uid }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders" })
  }
}

// ✅ Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all orders" })
  }
}

// ✅ Update Status (Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body

    await Order.findByIdAndUpdate(req.params.id, { status })

    res.json({ msg: "Status updated" })

  } catch (err) {
    res.status(500).json({ msg: "Error updating status" })
  }
}

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) return res.status(404).json({ msg: "Order not found" })

    if (order.status !== "Pending") {
      return res.status(400).json({ msg: "Cannot cancel this order" })
    }

    order.status = "Cancelled"
    await order.save()

    res.json({ msg: "Order cancelled" })
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling order" })
  }
}
// ✅ Remove Item from Order
exports.removeOrderItem = async (req, res) => {
  try {
    const { index } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) return res.status(404).json({ msg: "Order not found" })

    // ❌ REMOVE THIS BLOCK
    // if (order.status !== "Pending") {
    //   return res.status(400).json({ msg: "Cannot remove item now" })
    // }

    // ✅ Validate index
    if (index === undefined || index < 0 || index >= order.items.length) {
      return res.status(400).json({ msg: "Invalid index" })
    }

    // ✅ Remove item
    order.items.splice(index, 1)

    // ✅ If no items left → delete order
    if (order.items.length === 0) {
      await Order.findByIdAndDelete(req.params.id)
      return res.json({ msg: "Order deleted completely" })
    }

    // ✅ Recalculate total
    order.totalAmount = order.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )

    await order.save()

    res.json({ msg: "Item removed", order })

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error removing item" })
  }
}
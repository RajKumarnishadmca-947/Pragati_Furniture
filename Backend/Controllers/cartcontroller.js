const Cart = require("../Models/cartmodel")

// ✅ Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { pid, uid, title, price, img } = req.body

    console.log("ADD BODY:", req.body)

    // ✅ force string (important fix)
    const userId = uid.toString()

    const exists = await Cart.findOne({ pid, uid: userId })

    if (exists) {
      exists.qty += 1
      await exists.save()
      return res.json({ msg: "Quantity increased" })
    }

    const newCart = new Cart({
      pid,
      uid: userId,   // ✅ fixed
      title,
      price,
      img,
      qty: 1         // ✅ fixed
    })

    await newCart.save()

    res.json({ msg: "Added to cart" })

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error adding to cart" })
  }
}


// ✅ Get Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.uid.toString()  // ✅ fixed

    console.log("FETCH UID:", userId)

    const cartItems = await Cart.find({ uid: userId })

    console.log("CART DATA:", cartItems)

    res.json(cartItems)

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error fetching cart" })
  }
}


// ✅ Increase Qty
exports.increaseQty = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id)

    if (!item) return res.status(404).json({ msg: "Item not found" })

    item.qty += 1
    await item.save()

    res.json(item)
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error increasing qty" })
  }
}


// ✅ Decrease Qty
exports.decreaseQty = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id)

    if (!item) return res.status(404).json({ msg: "Item not found" })

    if (item.qty > 1) {
      item.qty -= 1
      await item.save()
    }

    res.json(item)
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error decreasing qty" })
  }
}


// ✅ Remove Item
exports.removeCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.json({ msg: "Item removed" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error deleting item" })
  }
}
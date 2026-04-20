const express = require("express")
const router = express.Router()

const {
  addToCart,
  getCart,
  removeCart,
  increaseQty,
  decreaseQty
} = require("../Controllers/cartcontroller")

router.post("/addcart", addToCart)
router.get("/cart/:uid", getCart)

router.put("/increase/:id", increaseQty)   // ✅ NEW
router.put("/decrease/:id", decreaseQty)   // ✅ NEW

router.delete("/removeCart/:id", removeCart)

module.exports = router
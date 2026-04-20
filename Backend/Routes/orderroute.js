const express = require("express")
const OrderRoute = express.Router()

const {placeOrder,getUserOrders,getAllOrders,updateStatus,cancelOrder,removeOrderItem} = require("../Controllers/ordercontroller")

OrderRoute.post("/place", placeOrder)
OrderRoute.get("/user/:uid", getUserOrders)
OrderRoute.get("/all", getAllOrders)
OrderRoute.put("/status/:id", updateStatus)
OrderRoute.put("/cancel/:id", cancelOrder)
OrderRoute.put("/remove-item/:id", removeOrderItem)

module.exports = OrderRoute
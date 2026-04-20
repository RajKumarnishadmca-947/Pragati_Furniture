const express = require("express")
const productRouter = express.Router()

const {addProduct,getProducts,getSingleProduct, updateProduct,deleteProduct, addcmnt, markPopular,removePopular} = require("../Controllers/productcontroller")
const upload = require("../Middleware/imageUpload")

// Routes
productRouter.post("/addproduct", upload.single("pimage"), addProduct)
productRouter.get("/getproducts", getProducts)
productRouter.get("/:id", getSingleProduct)
productRouter.post("/addcmnt",addcmnt)

// ✅ add upload here also for update
productRouter.put("/updateproduct/:id", upload.single("pimage"), updateProduct)

productRouter.delete("/deleteproduct/:id", deleteProduct)
// Popular Product Rout
productRouter.put("/popular/:id", markPopular)
productRouter.put("/remove-popular/:id", removePopular)
module.exports = productRouter
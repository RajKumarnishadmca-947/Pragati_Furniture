require('dotenv').config()
const express = require('express')
const cors = require("cors")
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");

const userRoute = require("./Routes/userroute")
const productRouter = require("./Routes/productroute")
const contactRoute=require("./Routes/contactroute")
const cartRoutes = require("./Routes/cartroute")
const orderRoute=require("./Routes/orderroute")


const PORT = process.env.PORT || 5000
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pragati-furniture-frontend.onrender.com"
  ],
  credentials: true
}))
app.use(cookieParser())


// DB Connection
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log("Database is connected")
})
.catch((err) => {
    console.log("Database not connected:", err.message)
})

// Routes (clean structure)
app.use("/users", userRoute)
app.use("/api/products", productRouter)
app.use("/api/contacts",contactRoute)
app.use("/api", cartRoutes)
app.use("/api/order",orderRoute)
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
require("dotenv").config()
const mongoose = require("mongoose")
const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")

const Product = require("./Models/productmodel")

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// DB connect
mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log("DB connected"))

const migrate = async () => {
  try {
    const products = await Product.find()

    for (let product of products) {
      // skip already migrated
      if (product.pimage.startsWith("http")) continue

      const imagePath = path.join(__dirname, "productsImages", product.pimage)

      if (!fs.existsSync(imagePath)) {
        console.log("File not found:", imagePath)
        continue
      }

      // upload to cloudinary
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "products"
      })

      // update DB
      product.pimage = result.secure_url
      await product.save()

      console.log("Migrated:", product._id)
    }

    console.log("✅ Migration completed")
    process.exit()

  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

migrate()
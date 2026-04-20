const mongoose=require('mongoose')

const productSchema = new mongoose.Schema({
  pimage: { type: String, required: true },
  ptitle: { type: String, required: true },
  pmodel_no: { type: String, required: true },
  pdescription: { type: String, required: true },
  pprice: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  
  comment: [
    {
      name: String,
      comm: String,
      rating: Number,
      createdAt: { type: Date, default: Date.now }
    }
  ]
})
const products=mongoose.model('products',productSchema)
module.exports=products;
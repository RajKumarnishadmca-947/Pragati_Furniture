const products=require("../Models/productmodel")


    const addProduct = async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({ msg: "Image is required" });
        }

        const newProduct = new products({
        ...req.body,
        pimage: req.file.path   // ✅ CLOUDINARY URL
        });

        await newProduct.save();

        res.status(201).json({
        msg: "Product added successfully",
        product: newProduct
        });

    } catch (error) {
        console.log("❌ CLOUDINARY ERROR:", error)
        res.status(500).json({ msg: "Error in adding product" });
    }
    };

// ➤ Get All Products
const getProducts = async (req, res) => {
    try {
        const data = await products.find()

        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            msg: "Error fetching products"
        })
    }
}


// ➤ Get Single Product
const getSingleProduct = async (req, res) => {
    try {
        const product = await products.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ msg: "Product not found" })
        }

        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({ msg: "Error fetching product" })
    }
}


// ➤ Update Product
const updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body }

        // ✅ if new image uploaded
        if (req.file) {
            updateData.pimage = req.file.path;
        }

        const updated = await products.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )

        if (!updated) {
            return res.status(404).json({ msg: "Product not found" })
        }

        res.status(200).json({
            msg: "Product updated successfully",
            product: updated
        })

    } catch (error) {
        res.status(500).json({ msg: "Error updating product" })
    }
}


// ➤ Delete Product
const deleteProduct = async (req, res) => {
    try {
        const deleted = await products.findByIdAndDelete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ msg: "Product not found" })
        }

        res.status(200).json({ msg: "Product deleted successfully" })

    } catch (error) {
        res.status(500).json({ msg: "Error deleting product" })
    }
}


const addcmnt = async (req, res) => {
  try {
    const { pid, name, comm, rating } = req.body;

    const updatedProduct = await products.findByIdAndUpdate(
      pid,   // ✅ FIXED
      {
        $push: {
          comment: {
            name,
            comm,
            rating
          }
        }
      },
      { new: true } // ✅ return updated product
    );

    res.json(updatedProduct); // ✅ send updated data

  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Error in adding comment" });
  }
};

const markPopular = async (req, res) => {
  try {
    const product = await products.findByIdAndUpdate(
      req.params.id,
      { isPopular: true },
      { new: true }
    )

    res.json({ msg: "Added to popular", product })
  } catch {
    res.status(500).json({ msg: "Error" })
  }
}

const removePopular = async (req, res) => {
  try {
    const product = await products.findByIdAndUpdate(
      req.params.id,
      { isPopular: false },
      { new: true }
    )

    res.json({ msg: "Removed from popular", product })
  } catch {
    res.status(500).json({ msg: "Error" })
  }
}

module.exports = {addProduct,getProducts,getSingleProduct,updateProduct,deleteProduct,addcmnt,markPopular,removePopular}
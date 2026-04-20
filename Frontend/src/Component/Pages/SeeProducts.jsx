import { useEffect, useState, useContext, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"
import { toast } from "react-toastify"
import "../CSS/SeeProducts.css"

const SeeProducts = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [search, setSearch] = useState("")

  const [loading, setLoading] = useState(true)
  const [loadingCart, setLoadingCart] = useState(null)
  const [loadingPopular, setLoadingPopular] = useState(null)

  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // ✅ Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/products/getproducts"
      )
      setProducts(data || [])
      setFilteredProducts(data || []) // ✅ important
    } catch (err) {
      console.error("Fetch products error:", err)
      toast.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ✅ Search with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!search.trim()) {
        setFilteredProducts(products)
      } else {
        const filtered = products.filter(item =>
          item.ptitle.toLowerCase().includes(search.toLowerCase()) ||
          item.pmodel_no.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredProducts(filtered)
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [search, products])

  // ✅ Add to cart
  const handleAddToCart = async (product) => {
  if (!user?.id) {
    navigate("/login")
    return
  }

  setLoadingCart(product.id)

  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/addcart",
      {
        pid: product._id,
        uid: user.id, // ✅ FIXED
        title: product.ptitle,
        price: Number(product.pprice),
        img: product.pimage
      }
    )

    toast.success(data?.msg || "Added to cart")
     
  } catch (err) {
    toast.error("Failed to add to cart")
  } finally {
    setLoadingCart(null)
  }
}

  // ✅ Add to popular
  const handlePopular = async (id) => {
    setLoadingPopular(id)
    try {
      await axios.put(
        `http://localhost:5000/api/products/popular/${id}`
      )
      toast.success("Added to Popular")
    } catch (err) {
      console.error("Popular error:", err)
      toast.error("Failed to update")
    } finally {
      setLoadingPopular(null)
    }
  }

  // ✅ Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?")
    if (!confirmDelete) return

    try {
      await axios.delete(
        `http://localhost:5000/api/products/deleteproduct/${id}`
      )

      const updated = products.filter(item => item._id !== id)
      setProducts(updated)
      setFilteredProducts(updated)

      toast.success("Product deleted")
    } catch (err) {
      console.error("Delete error:", err)
      toast.error("Failed to delete")
    }
  }

  return (
    <div className="km">
      <h1 className="heading">All Products</h1>

      {/* ✅ SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No matching products found 🔍</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((item) => (
            <div key={item._id} className="km-card">
              <img
                src={`http://localhost:5000/productsImages/${item.pimage}`}
                alt={item.ptitle}
                className="product-img"
              />

              <h2>{item.ptitle}</h2>
              <p><b>Price:</b> ₹ {item.pprice}</p>
              <p><b>Model-No:</b> {item.pmodel_no}</p>

              <div className="btn-group">
                <button
                  className="btn"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  Know More
                </button>

                <button
                  className="btn"
                  onClick={() => handleAddToCart(item)}
                  disabled={loadingCart === item._id}
                >
                  {loadingCart === item._id ? "Adding..." : "Add To Cart"}
                </button>

                {user?.role === "admin" && (
                  <>
                    <button
                      className="btn"
                      onClick={() => handlePopular(item._id)}
                      disabled={loadingPopular === item._id}
                    >
                      {loadingPopular === item._id
                        ? "Adding..."
                        : "Add to Popular"}
                    </button>

                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete Product
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SeeProducts
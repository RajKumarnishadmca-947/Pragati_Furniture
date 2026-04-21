import { useEffect, useState, useContext, useCallback } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "../CSS/AddToCart.css"
const url = import.meta.env.VITE_API_URL;

const AddToCart = () => {
  const { user, setUser } = useContext(AuthContext)

  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [total, setTotal] = useState(0)

  const navigate = useNavigate()

  // ✅ Calculate total
  const calculateTotal = useCallback((data) => {
    const sum = data.reduce((acc, item) => acc + item.price * item.qty, 0)
    setTotal(sum)
  }, [])

  // ✅ Fetch cart
  const getCart = useCallback(async () => {
  if (!user?.id) {
    setLoading(false)
    return
  }

  try {
    setLoading(true)

    const { data } = await axios.get(`${url}/api/cart/${user.id}`)

    setCart(data || [])
    calculateTotal(data || [])

  } catch (err) {
    console.error("Error fetching cart:", err)
    toast.error("Failed to load cart")
  } finally {
    setLoading(false)
  }
}, [user, calculateTotal])

  // ✅ Handle user state
  useEffect(() => {
    if (user === undefined) return

    if (!user) {
      navigate("/login")
    } else {
      getCart()
    }
  }, [user, getCart, navigate])

  // ✅ Update quantity
  const updateQuantity = async (id, type) => {
    try {
      await axios.put(`${url}/api/${type}/${id}`)
      getCart()
    } catch (err) {
      console.error("Quantity update error:", err)
      toast.error("Failed to update quantity")
    }
  }

  // ✅ Remove item
  const removeItem = async (id) => {
    try {
      await axios.delete(`${url}/api/removeCart/${id}`)

      const updatedCart = cart.filter(item => item._id !== id)
      setCart(updatedCart)
      calculateTotal(updatedCart)

      setUser(prev => ({
        ...prev,
        cartlength: Math.max((prev?.cartlength || 1) - 1, 0)
      }))

      toast.success("Item removed")
    } catch (err) {
      console.error("Remove error:", err)
      toast.error("Failed to remove item")
    }
  }

  // ✅ Place order (PROFESSIONAL FIX)
  const placeOrder = async () => {
    try {
      setPlacingOrder(true)

      await axios.post(`${url}/api/order/place`, {
        userId: user.id
      })

      toast.success("Order placed successfully 🎉")

      // ✅ Instant UI update
      setCart([])
      setTotal(0)
      

      setUser(prev => ({
        ...prev,
        cartlength: 0
      }))

      // ✅ Redirect smoothly
      setTimeout(() => {
        navigate("/userorder")
      }, 1200)

    } catch (err) {
      console.error("Order error:", err)
      toast.error("Order failed ❌")
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className="km">

      {/* ✅ Loading */}
      {loading && <p>Loading cart...</p>}

      {/* ✅ Empty Cart */}
      {!loading && cart.length === 0 && (
        <h3 style={{ color: "orange" }}>Your cart is empty 🛒</h3>
      )}

      {/* ✅ Cart Items */}
      {!loading && cart.length > 0 && (
        <>
          <div className="product-grid">
            {cart.map((item) => (
              <div key={item._id} className="km-card">
                <img
                  src={
                      item.img?.startsWith("http")
                        ? item.img
                        : `${url}/productsImages/${item.img}`
                    }
                  alt={item.title}
                  className="product-img"
                />

                <h2>{item.title}</h2>
                <p><b>Price:</b> ₹ {item.price}</p>

                {/* ✅ Quantity */}
                <div className="qty-box">
                  <button onClick={() => updateQuantity(item._id, "decrease")}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQuantity(item._id, "increase")}>+</button>
                </div>

                <p><b>Total:</b> ₹ {item.price * item.qty}</p>

                {/* ✅ Remove */}
                <div className="btn-group">
                  <button
                    className="btn"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Total + Place Order */}
          <div className="total-box">
            <h2>Total: ₹ {total}</h2>

            <button
              className="btn"
              onClick={placeOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Your Order"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AddToCart
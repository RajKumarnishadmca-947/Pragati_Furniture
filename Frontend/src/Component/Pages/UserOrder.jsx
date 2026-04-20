import { useEffect, useState, useContext } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import "../CSS/UserOrder.css"

const UserOrder = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])

 // ✅ Fetch Orders
const fetchOrders = async () => {
  if (!user?.id) return

  try {
    const res = await axios.get(
      `http://localhost:5000/api/order/user/${user.id}`
    )
    setOrders(res.data)
  } catch (err) {
    console.log("Fetch Orders Error:", err)
  }
}

useEffect(() => {
  fetchOrders()
}, [user])

// ✅ Cancel Order (ONLY Pending)
const cancelOrder = async (id) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this order?"
  )
  if (!confirmCancel) return

  try {
    await axios.put(`http://localhost:5000/api/order/cancel/${id}`)
    fetchOrders()
  } catch (err) {
    console.log("Cancel Error:", err)
    alert("Cancel failed")
  }
}

// ✅ Remove Item (ALWAYS ALLOWED)
const removeItem = async (orderId, index) => {
  const confirmRemove = window.confirm(
    "Remove this product from order?"
  )
  if (!confirmRemove) return

  try {
    await axios.put(
      `http://localhost:5000/api/order/remove-item/${orderId}`,
      { index }
    )

    fetchOrders()
  } catch (err) {
    console.log("Remove Error:", err)
    alert("Remove failed")
  }
}

// ✅ Go to product
const goToProduct = (pid) => {
  if (!pid) return
  navigate(`/product/${pid}`)
}
  return (
    <div className="user-orders">
  <h2 className="uo-title">My Orders</h2>
  {orders.map(order => (
    <div key={order._id} className="uo-card">

      {/* Header */}
      <div className="uo-header">
        <h3 className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </h3>
        <p className="uo-total">₹ {order.totalAmount}</p>
      </div>

      {/* Date */}
      <p className="uo-date">
        <span>Ordered On:</span>
        <span className="date-box">
          {new Date(order.createdAt).toLocaleDateString()} |{" "}
          {new Date(order.createdAt).toLocaleTimeString()}
        </span>
      </p>

      {/* Timeline */}
      {order.status !== "Cancelled" ? (
       <div className="tracking">
        <div className={`track-step ${order.status !== "Pending" ? "done" : ""}`}>
          🕒 <span>Pending</span>
        </div>

        <div className={`track-step ${["Confirmed","Shipped","Delivered"].includes(order.status) ? "done" : ""}`}>
          ✅ <span>Confirmed</span>
        </div>

        <div className={`track-step ${["Shipped","Delivered"].includes(order.status) ? "done" : ""}`}>
          🚚 <span>Shipped</span>
        </div>

        <div className={`track-step ${order.status === "Delivered" ? "done" : ""}`}>
          📦 <span>Delivered</span>
        </div>
</div>
      ) : (
        <p className="cancel-text">Order Cancelled ❌</p>
      )}

      {/* ✅ Cancel Button (ONLY Pending) */}
      {order.status === "Pending" && (
        <button 
          className="cancel-btn"
          onClick={() => cancelOrder(order._id)}
        >
          Cancel Order
        </button>
      )}

      {/* Items */}
      <div className="uo-items">
        {order.items.map((item, i) => (
          <div key={i} className="uo-item">

            <img
              src={`http://localhost:5000/productsImages/${item.img}`}
              alt={item.title}
            />

            <div className="uo-item-info">
              <p className="uo-item-title">{item.title}</p>
              <p className="uo-item-qty">Qty: {item.qty}</p>

              {/* ✅ ACTION BUTTONS */}
              <div className="uo-item-actions">
                <button 
                  className="view-btn"
                  onClick={() => goToProduct(item.pid)}
                >
                  View Product
                </button>

                {/* ✅ ALWAYS SHOW REMOVE */}
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(order._id, i)}
                >
                  Remove
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  ))}
</div>
  )
}

export default UserOrder
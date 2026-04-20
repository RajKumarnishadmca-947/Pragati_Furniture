import { useEffect, useState } from "react"
import axios from "axios"
import "./AdminOrders.css"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const ordersPerPage = 5

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/all")
      setOrders(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // ✅ FILTER + SEARCH
  const filteredOrders = orders.filter(order => {
    const matchSearch =
      order.userName?.toLowerCase().includes(search.toLowerCase()) ||
      order.userPhone?.includes(search)

    const matchStatus =
      statusFilter === "All" || order.status === statusFilter

    return matchSearch && matchStatus
  })

  // ✅ PAGINATION
  const indexOfLast = currentPage * ordersPerPage
  const indexOfFirst = indexOfLast - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast)

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/order/status/${id}`, { status })
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>

      {/* ✅ SEARCH + FILTER */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <>
          {/* ✅ TABLE */}
          <table className="orders-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td data-label="User">{order.userName || "N/A"}</td>
                  <td data-label="Phone">{order.userPhone || "N/A"}</td>

                  <td data-label="Date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td data-label="Time">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  {/* ✅ Items */}
                  <td data-label="Items">
                    {order.items.map((item, i) => (
                      <div key={i} className="item-box">
                        <img
                          src={`http://localhost:5000/productsImages/${item.img}`}
                          alt={item.title}
                        />
                        <span>{item.title} (x{item.qty})</span>
                      </div>
                    ))}
                  </td>

                  <td data-label="Total">₹ {order.totalAmount}</td>

                  {/* ✅ Status with color */}
                  <td data-label="Status">
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ PAGINATION */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminOrders
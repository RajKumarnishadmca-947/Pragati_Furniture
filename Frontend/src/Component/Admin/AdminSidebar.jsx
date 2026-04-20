import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import { AuthContext } from "../Pages/AuthContext"
import "./AdminSidebar.css"

const AdminSidebar = () => {
  const { user } = useContext(AuthContext)

  if (!user || user.role !== "admin") return null

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <NavLink to="/admin" className="link">🏠Pragati_Furniture</NavLink>

        <NavLink to="/admin/products" className="link">📦 Products</NavLink>

        <NavLink to="/admin/addproduct" className="link">
          ➕ Add Product
        </NavLink>

        <NavLink to="/admin/orders" className="link">
          🛒 Orders
        </NavLink>

        <NavLink to="/admin/messages" className="link">
          📩 Messages
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar
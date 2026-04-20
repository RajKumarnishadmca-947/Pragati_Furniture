import React, { useContext, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../Pages/AuthContext'
import "./Navbar.css"
const url = import.meta.env.VITE_API_URL;


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  // ✅ Fetch cart count (SAFE VERSION)
  useEffect(() => {
    let isMounted = true

    const loadCartCount = async () => {
      try {
        if (user?.id) {
          const res = await axios.get(
            `${url}/api/cart/${user.id}`
          )

          if (isMounted) {
            setUser(prev => ({
              ...prev,
              cartlength: res.data?.length || 0
            }))
          }
        }
      } catch (err) {
        console.log("Cart count error:", err)

        // fallback
        setUser(prev => ({
          ...prev,
          cartlength: 0
        }))
      }
    }

    loadCartCount()

    return () => {
      isMounted = false
    }
  }, [user?.id]) // ✅ only runs when user changes

  const handleLogout = async () => {
    try {
      await axios.post(
        `${url}/users/logout`,
        {},
        { withCredentials: true }
      )

      setUser(null)
      setMenuOpen(false)
      navigate("/login")

    } catch (err) {
      console.log(err)
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className='nav'>

      {/* LOGO */}
      <div id='logo'>
        <NavLink to="/" onClick={closeMenu}>
          <h3>Pragati_Furniture</h3>
        </NavLink>
      </div>

      {/* HAMBURGER */}
      <div 
        className={`hamburger ${menuOpen ? "active" : ""}`} 
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* MENU */}
      <div className={`menu ${menuOpen ? "active" : ""}`}>

        {!user ? (
          <>
            <NavLink to="/register" onClick={closeMenu}>Register</NavLink>
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
          </>
        ) : (
          <>
            <span className="username">
              👋 {user?.name || "User"}
            </span>

            <NavLink to='/' onClick={closeMenu}>Home</NavLink>
            <NavLink to="/seeproducts" onClick={closeMenu}>Products</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>

            {/* ✅ PROFESSIONAL CART */}
            <NavLink to="/cart" onClick={closeMenu} className="cart-link">
              🛒 Cart
              <span className="cart-badge">
                {user?.cartlength ?? 0}
              </span>
            </NavLink>

            <NavLink to="/userorder" onClick={closeMenu}>Orders</NavLink>

            {/* ADMIN */}
            {user?.role === "admin" && (
              <NavLink to="/admin" onClick={closeMenu}>
                Admin Panel
              </NavLink>
            )}

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default Navbar
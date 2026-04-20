import React, { useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from './Component/Pages/AuthContext'

import Register from './Component/Pages/Register'
import Login from './Component/Pages/Login'
import Home from './Component/Pages/Home'
import Products from './Component/Pages/SeeProducts'
import AddProducts from './Component/Pages/AddProducts'
import Navbar from './Component/Navbar/Navbar'
import Contact from './Component/Pages/Contact'
import ProductDetails from './Component/Pages/ProductDetails'
import AddToCart from './Component/Pages/AddToCart'
import EmailVerify from "./Component/Pages/EmailVerify"
import ForgotPassword from "./Component/Pages/ForgotPassword"
import ResetPassword from "./Component/Pages/ResetPassword"
import UserOrder from './Component/Pages/UserOrder'
import Error from './Component/Pages/Error'

// FOR ADMIN IMPORTS
import AdminOrders from './Component/Admin/AdminOrders'
import Message from './Component/Admin/Message'
import AdminLayout from './Component/Admin/AdminLayout'
import AdminRoute from './Component/Admin/AdminRoute'

const App = () => {
  const {setUser}=useContext(AuthContext)

  useEffect(()=>{
  const getUser=async()=>{
    try {
      const res= await axios.get(`${url}/users/profile`,{ withCredentials: true })
      setUser(res.data.user)
    } catch (err) {
      setUser(null)
    }
  }

  // Only call if cookie exists
  if (document.cookie.includes("token")) {
    getUser()
  } else {
    setUser(null)
  }
},[])

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/seeproducts' element={<Products />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<AddToCart />} />
        <Route path='/userorder' element={<UserOrder/>} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/*' element={<Error/>}/>

        {/* ADMIN PANEL (NESTED ROUTES) */}
        <Route path="/admin" element={<AdminRoute> <AdminLayout/> </AdminRoute>}>
          <Route path="products" element={<Products/>}/>
          <Route path="addproduct" element={<AddProducts/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="messages" element={<Message/>}/> 
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
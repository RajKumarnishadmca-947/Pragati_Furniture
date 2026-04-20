import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import "../CSS/Register.css"

const url = import.meta.env.VITE_API_URL;


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address:"",
    pin:""
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${url}/users/register`,form)

      toast.success(res.data.msg)

      // 👉 redirect to verify page with email
      navigate("/verify-email", { state: { email: form.email } })

    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed")
    }
  }

  return (
    <div className='container'>
      <h1 className='heading' style={{marginLeft:"5px"}}>Register</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <input type='text' name='name' value={form.name} onChange={handleChange} placeholder='Name' required />
        <input type='text' name='phone' value={form.phone} onChange={handleChange} placeholder='Phone' required />
        <input type='email' name='email' value={form.email} onChange={handleChange} placeholder='Email' required />
        <input type='password' name='password' value={form.password} onChange={handleChange} placeholder='Password' required />
        <input type='text' name='address' value={form.address} onChange={handleChange} placeholder='Yours Address' required />
        <input type='text' name='pin' value={form.pin} onChange={handleChange} placeholder='Area Pin' required />

        <button type="submit" className='btn'>Register</button>
      </form>
    </div>
  )
}

export default Register
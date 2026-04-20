import React, { useState,useContext,useEffect } from 'react'
import {toast} from "react-toastify"
import axios from 'axios'
import "../CSS/Contact.css"
import { AuthContext } from './AuthContext'

const Contact = () => {
  const {user}=useContext(AuthContext);

    const [contForm,setContForm]=useState({email:"",name:"",phone:"",message:""})

    const fun=async(e)=>{
        setContForm({...contForm,[e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const res = await axios.post(
      "http://localhost:5000/api/contacts/addcontact",
      contForm
    )

    toast.success(res.data.msg)

    // ✅ KEEP name & email, clear only phone & message
    setContForm(prev => ({
      ...prev,
      phone: "",
      message: ""
    }))

  } catch (err) {
    toast.error(err.response?.data?.msg || "Something went wrong ")
  }
}

    // ✅ AUTO FILL when user exists
useEffect(() => {
  if (user) {
    setContForm(prev => ({
      ...prev,
      name: user.name || "",
      email: user.email || ""
    }))
  }
}, [user])

  return (
     <div className="contact-container">

      {/* LEFT SIDE */}
      <div className="contact-left">
        <h1 className="contact-heading">Contact</h1>

        <div className="contact-item">
          <label>Mobile:</label>
          <p>82636839</p>
        </div>

        <div className="contact-item">
          <label>Email:</label>
          <p>9267997</p>
        </div>

        <div className="contact-item">
          <label>Address:</label>
          <p>jfasufhjsnvijfojk</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="contact-right">
        <form onSubmit={handleSubmit} className="contact-form">
          <input type="text" placeholder="Your Name" name="name" value={contForm.name} onChange={fun} readOnly/>
          <input type="email" placeholder="Your Email" name="email" value={contForm.email} onChange={fun} readOnly/>
          <input type="text" placeholder="Your Phone" name="phone" value={contForm.phone} onChange={fun} required/>
          <textarea placeholder="Your Message" name="message" value={contForm.message} onChange={fun} required/>
          <button type="submit">Send Message</button>
        </form>
      </div>

    </div>
  )
}

export default Contact
import React, { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import '../CSS/ForgotPassword.css'
const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/users/forgot-password", { email })
      toast.success("OTP sent")

      navigate("/reset-password", { state: { email } })

    } catch (err) {
      toast.error(err.response?.data?.msg || "Error")
    }
  }

  return (
     <div className="container">
    <div className="forgot-box">
      <h2>Forgot Password</h2>

      <p>Enter your email to receive OTP</p>

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="forgot-btn" onClick={handleSubmit}>
        Send OTP
      </button>
    </div>
  </div>
  )
}

export default ForgotPassword
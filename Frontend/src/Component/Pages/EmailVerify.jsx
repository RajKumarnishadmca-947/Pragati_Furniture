import React, {useState} from "react"
import {useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import {toast} from "react-toastify"
import "../CSS/EmailVerify.css"

const EmailVerify=()=> {
  const [otp,setOtp]=useState("")
  const location=useLocation()
  const navigate=useNavigate()

  const email=location.state?.email

  const handleVerify=async()=>{
    try {
      const res=await axios.post("http://localhost:5000/users/verify-otp",{email,otp})
      toast.success(res.data.msg)
      navigate("/login")

    } catch(err) {
      toast.error(err.response?.data?.msg || "Verification failed")
    }
  }

  const resendOtp=async()=>{
    try {
      await axios.post("http://localhost:5000/users/send-otp", { email })
      toast.success("OTP resent")
    } catch {
      toast.error("Failed to resend OTP")
    }
  }

  return (
    <div className="container">
    <div className="verify-box">
      <h2>Verify Email</h2>

      <p>{email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button className="verify-btn" onClick={handleVerify}>
        Verify
      </button>

      <button className="resend-btn" onClick={resendOtp}>
        Resend OTP
      </button>
    </div>
  </div>
  )
}

export default EmailVerify
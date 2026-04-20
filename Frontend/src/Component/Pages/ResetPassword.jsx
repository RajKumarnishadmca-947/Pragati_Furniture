import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const ResetPassword = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")

  const handleReset = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/users/reset-password",
        { email, otp, newPassword: password }
      )

      toast.success(res.data.msg)
      navigate("/login")

    } catch (err) {
      toast.error(err.response?.data?.msg || "Reset failed")
    }
  }

  return (
    <div className="container">
      <h2>Reset Password</h2>

      <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <input placeholder="New Password" type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  )
}

export default ResetPassword
import React, { useState, useContext } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { toast } from 'react-toastify'
import axios from 'axios'
import { AuthContext } from './AuthContext'
import '../CSS/Login.css'

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(
                "http://localhost:5000/users/login",
                form,
                { withCredentials: true }
            )

            toast.success(res.data.msg)

            setUser({
                id: res.data.id,   // ✅ IMPORTANT
                name: res.data.name,
                email: res.data.email,
                role: res.data.role
                })

                localStorage.setItem("user", JSON.stringify({
                id: res.data.id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role
            }))

            setForm({ email: "", password: "" })
            navigate("/")

        } catch (err) {
            toast.error(err.response?.data?.msg || "Login failed")
        }
    }

    return (
        <div className="container">
            <h1 className="heading" style={{marginLeft:"5px"}}>Login</h1>

            <form onSubmit={handleSubmit} className="form-box">

                <input
                    type='email'
                    name='email'
                    value={form.email}
                    placeholder='Enter your email'
                    onChange={handleChange}
                    required
                />

                <input
                    type='password'
                    name='password'
                    value={form.password}
                    placeholder='Enter your password'
                    onChange={handleChange}
                    required
                />

               

                <button type="submit" className="btn">Login</button>
                 {/* 🔥 Forgot Password Link */}
                <p style={{ textAlign: "right", marginTop: "5px" }}>
                    <Link to="/forgot-password" style={{ color: "blue", fontSize: "14px" }}>
                        Forgot Password?
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login
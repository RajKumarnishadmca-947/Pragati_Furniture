const users = require("../Models/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})
console.log("EMAIL:", process.env.EMAIL_USER)
console.log("PASS:", process.env.EMAIL_PASS)

// Test connection once
transporter.verify((err, success) => {
  if (err) {
    console.log("Mail config error:", err)
  } else {
    console.log("Mail server is ready ✅")
  }
})


// ================= REGISTER + SEND OTP =================
const adduser = async (req, res) => {
  try {
    const { email, password } = req.body

    const existuser = await users.findOne({ email })
    if (existuser) {
      return res.status(400).json({ msg: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const newuser = new users({
      ...req.body,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000
    })

    await newuser.save()

    // ✅ Send mail safely
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        text: `Your OTP is ${otp}`
      })
    } catch (mailError) {
      console.log("Mail Error:", mailError)
    }

    res.status(201).json({
      msg: "Registration successful. OTP sent",
      email: newuser.email
    })

  } catch (error) {
    console.error("REGISTER ERROR:", error)
    res.status(500).json({ msg: "Registration failed" })
  }
}


// ================= SEND OTP (RESEND / MANUAL) =================
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body

    const user = await users.findOne({ email })
    if (!user) {
      return res.status(404).json({ msg: "User not found" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.otp = otp
    user.otpExpire = Date.now() + 5 * 60 * 1000

    await user.save()

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resend OTP",
      text: `Your OTP is ${otp}`
    })

    res.json({ msg: "OTP resent successfully" })

  } catch (err) {
    res.status(500).json({ msg: "Failed to send OTP" })
  }
}
// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await users.findOne({ email })

    if (!user || user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" })
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpire = null

    await user.save()

    res.json({ msg: "Email verified successfully" })

  } catch (err) {
    res.status(500).json({ msg: "Verification failed" })
  }
}

// ================= LOGIN =================
const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await users.findOne({ email })
    if (!user) {
      return res.status(404).json({ msg: "User not registered" })
    }

    // 🔥 Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email first" })
    }
    console.log("Entered Password:", password)
    const isMatch = await bcrypt.compare(password, user.password)
    console.log("Password Match:", isMatch)
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid password" })
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRETKEY,
      { expiresIn: "1d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      msg: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })

  } catch (error) {
    res.status(500).json({ msg: "Login error", error: error.message })
  }
}

// ================= LOGOUT =================
const logoutuser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    })

    res.status(200).json({ msg: "Logout successful" })
  } catch (error) {
    res.status(500).json({ msg: "Logout error" })
  }
}

// ================= GET PROFILE =================
const getProfile = async (req, res) => {
  try {
    const user = await users.findById(req.user.id).select("-password")
    res.json({ user })
  } catch (err) {
    res.status(500).json({ msg: "Error fetching profile" })
  }
}

// ================= GET USERS =================
const getuser = async (req, res) => {
  try {
    const userdata = await users.find().select("-password")
    res.status(200).json(userdata)
  } catch {
    res.status(500).json({ msg: "Error getting users" })
  }
}

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await users.findOne({ email })
    if (!user) return res.status(404).json({ msg: "User not found" })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.resetOtp = otp
    user.resetOtpExpire = Date.now() + 5 * 60 * 1000

    await user.save()

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}`
    })

    res.json({ msg: "Reset OTP sent" })

  } catch (err) {
    res.status(500).json({ msg: "Failed to send reset OTP" })
  }
}

// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (newPassword.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters"
      })
    }

    const user = await users.findOne({ email })

    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" })
    }

    if (user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" })
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    user.password = hashed
    user.resetOtp = null
    user.resetOtpExpire = null

    await user.save()

    res.json({ msg: "Password reset successful" })

  } catch (err) {
    res.status(500).json({ msg: "Reset failed" })
  }
}

// ================= EXPORT =================
module.exports = {
  adduser,
  sendOtp, 
  verifyOtp,
  loginuser,
  logoutuser,
  getProfile,
  getuser,
  forgotPassword,
  resetPassword
}
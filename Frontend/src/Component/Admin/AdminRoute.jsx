import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../Pages/AuthContext"

const AdminRoute=({children})=> {
  const {user}=useContext(AuthContext)

  // Prevent wrong redirect
  if (user === undefined) return <p>Loading...</p>

  if (!user) return <Navigate to="/login" />
  if (user.role !== "admin") return <Navigate to="/" />

  return children
}

export default AdminRoute
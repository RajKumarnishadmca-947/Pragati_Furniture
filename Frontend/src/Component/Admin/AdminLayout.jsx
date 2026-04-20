import AdminSidebar from "./AdminSidebar"
import {Outlet} from "react-router-dom"

const AdminLayout = () => {
  return (
    <div style={{display:"flex" }}>
      <AdminSidebar/>
      <div style={{marginLeft: "220px", padding: "20px", width: "100%", minHeight: "100vh", background: "#f8fafc"}}>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminLayout
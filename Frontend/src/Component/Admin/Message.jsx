import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../Pages/AuthContext'
import { useNavigate } from 'react-router-dom'

const Message = () => {
  const [messages, setMessages] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // ✅ Admin protection
  useEffect(() => {
    if (user === undefined) return

    if (!user || user.role !== "admin") {
      toast.error("Access denied ❌")
      navigate("/")
    }
  }, [user, navigate])

  // ✅ Fetch messages
  const getMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts/getcontact")
      setMessages(res.data.data || [])
      setFiltered(res.data.data || [])
    } catch {
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  // ✅ Search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!search.trim()) {
        setFiltered(messages)
      } else {
        const result = messages.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.message.toLowerCase().includes(search.toLowerCase())
        )
        setFiltered(result)
        setCurrentPage(1) // reset page
      }
    }, 300)

    return () => clearTimeout(delay)
  }, [search, messages])

  // ✅ Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this message?")
    if (!confirm) return

    try {
      await axios.delete(`http://localhost:5000/api/contacts/delete/${id}`)

      const updated = messages.filter(item => item._id !== id)
      setMessages(updated)
      setFiltered(updated)

      toast.success("Message deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  // ✅ Pagination Logic
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  return (
    <div>
      <h1>Messages Of Users</h1>

      {/* 🔍 Search */}
      <input className='message-container '
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        
      />

      {loading && <p>Loading...</p>}

      {!loading && filtered.length === 0 && <p>No Message Found</p>}

      {!loading && filtered.length > 0 && (
        <div className='table-wrapper'>
          <table border={2} className='message-table'>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th> {/* ✅ NEW */}
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.message}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>

                  {/* ✅ DELETE BUTTON */}
                  <td>
                    <button className='delete-btn' onClick={() => handleDelete(item._id)}
                      
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ PAGINATION */}
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message
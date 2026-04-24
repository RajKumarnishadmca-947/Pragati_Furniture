import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Rating from '@mui/material/Rating'
import StarIcon from '@mui/icons-material/Star'
import { AuthContext } from './AuthContext'
import {toast} from "react-toastify"
import "../CSS/ProductDetails.css"

const url = import.meta.env.VITE_API_URL;



const ProductDetails=()=> {
  const {id}=useParams()
  const navigate =useNavigate()
  const { user } =useContext(AuthContext)

  const [product,setProduct] =useState(null)
  const [error,setError]=useState("")
  const [msg,setMsg]=useState("")
  const [showMsg,setShowMsg]=useState(false)
  const [loadingCart, setLoadingCart] = useState(false)

  const [comment,setComment]=useState("")
  const [rating,setRating]=useState(5)

  // Pagination states
  const [currentPage,setCurrentPage]=useState(1)
  const commentsPerPage=5

  // Fetch Product
  useEffect(()=>{
    const getSingleProduct=async()=> {
      try {
        const res=await axios.get(`${url}/api/products/${id}`)
        setProduct(res.data)
      } catch{
        setError("Product not found or server error")
      }
    }
    getSingleProduct()
  }, [id])

  // ✅ Average Rating
  const avgRating=product?.comment?.length >0?(
          product.comment.reduce((acc, item)=>acc+item.rating, 0) /
          product.comment.length
        ).toFixed(1): 0

  // ✅ Pagination logic
  const totalComments=product?.comment?.length || 0
  const indexOfLast=currentPage * commentsPerPage
  const indexOfFirst=indexOfLast - commentsPerPage
  const sortedComments = [...(product?.comment || [])].reverse()
  const currentComments = sortedComments.slice(indexOfFirst, indexOfLast)
  const totalPages=Math.ceil(totalComments / commentsPerPage)

  // Add Comment
  const addComment=async()=>{
    if (!user)return navigate("/login")

    if (!comment.trim()) {
      toast.error("Please enter a comment")
      return
    }else{
      toast.success("Comment added successful")
    }

    try {
      const res=await axios.post(`${url}/api/products/addcmnt`,{
          pid: product._id,
          name: user.name,
          comm: comment,
          rating: rating || 1
        }
      )

      setProduct(res.data)

      setMsg("Comment added")
      setShowMsg(true)

      setComment("")
      setRating(5)

      setCurrentPage(1) // reset to first page

      setTimeout(()=>setShowMsg(false), 2000)
    } catch {
      setMsg("Error")
      setShowMsg(true)
    }
  }

  if (error) return <p>{error}</p>
  if (!product) return <p>Loading...</p>

  // Add to card button
  const addToCart = async () => {
  if (!user?.id) {
    navigate("/login")
    return
  }

  try {
    setLoadingCart(true)

    const res = await axios.post(`${url}/api/addcart`, {
      pid: product._id,
      uid: user.id, // ✅ FIXED (same as SeeProducts)
      title: product.ptitle,
      price: Number(product.pprice),
      img: product.pimage
    })

    toast.success(res.data.msg || "Added to cart")

  } catch (err) {
    console.log(err)
    toast.error("Failed to add")
  } finally {
    setLoadingCart(false)
  }
}

  return (
    <div className="pd-container">

  {/* Product */}
  <div className="pd-product">
    <img src={product.pimage?.startsWith("http")? product.pimage : `${url}/productsImages/${product.pimage}`}alt={product.ptitle}/>
    <div className="pd-product-details">
      <h2>{product.ptitle}</h2>
      <p>{product.pdescription}</p>
      <h3>₹: {product.pprice}</h3>

      <div className="pd-rating">
        <Rating value={Number(avgRating)} precision={0.5} readOnly />
        <span> ({product.comment?.length || 0} reviews)</span>
      </div>
    </div>
    {/* Add cart button */}
    <button style={{height:"25px",background:"blue",color:'white',cursor:"pointer"}} onClick={addToCart} disabled={loadingCart}>
    {loadingCart ? "Adding..." : "Add To Cart"}
  </button>
  </div>


  {/* Alert */}
  {showMsg && <div className="pd-alert">{msg}</div>}

  {/* Comments */}
  <div className="pd-comments">
    <h3>Customer Reviews</h3>

    {totalComments === 0 && <p>No reviews yet</p>}

    {currentComments?.map((item, index) => (
      <div key={index} className="pd-comment-card">
        <h4>{item.name}</h4>
        <Rating value={item.rating} readOnly size="small" />
        <p>{item.comm}</p>
        <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</small>
      </div>
    ))}

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="pd-pagination">
        <button disabled={currentPage === 1} onClick={()=>setCurrentPage(currentPage - 1)}>Prev</button>

        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={()=>setCurrentPage(i+1)} className={currentPage === i+1 ? "active":""}>{i+1}</button>
        ))}

        <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(currentPage+1)}>Next</button>
      </div>
    )}
  </div>

  {/* Add Review */}
  {user && (
    <div className="pd-add-review">
      <h3>Write a Review</h3>

      <textarea placeholder="Enter your comment" value={comment} onChange={(e)=>setComment(e.target.value)}/>

      <Rating value={rating} precision={0.5} onChange={(e,newValue)=>setRating(newValue || 1)} emptyIcon={<StarIcon style={{ opacity: 0.5 }} />}/>
      <button onClick={addComment}>Submit Review</button>
    </div>
  )}
</div>
  )
}

export default ProductDetails
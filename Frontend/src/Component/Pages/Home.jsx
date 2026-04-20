import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/Home.css";

import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import {toast} from "react-toastify";


const Home = () => {

  const {user}=useContext(AuthContext)
  const [popular, setPopular] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    const getPopular=async()=>{
      const res=await axios.get("http://localhost:5000/api/products/getproducts")

         // filter only popular
      const filtered = res.data.filter(p => p.isPopular)
      setPopular(filtered)
    }
    getPopular()
  },[])

  // Know more button
  let knowMore=(id)=>{
    if(!user){
      toast.error("Please login first")
      navigate("/login")
    }else{
      navigate(`/product/${id}`)
    }
  }

  // Shop now button
   let shopnow=()=>{
    if(!user){
      toast.error("Please login first")
      navigate("/login")
    }else{
      navigate("/seeproducts" )
    }
  }

  // Delete product from Popular Products
const removeFromPopular = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/products/remove-popular/${id}`);

    const updated = popular.filter((item) => item._id !== id);
    setPopular(updated);

    toast.success("Removed from Popular");
  } catch (error) {
    console.log(error);
    toast.error("Error removing");
  }
};

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>In Gorakhpur</h1>
          <h2>Elegant Furniture for Your Home</h2>
          <p>Upgrade your living space with modern and stylish furniture</p>
          <button className="shop-btn" onClick={shopnow}>Shop Now</button>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="features">
        <div className="feature-box">
          <h3>Premium Quality</h3>
          <p>Best materials with long-lasting durability</p>
        </div>
        <hr></hr>
        <div className="feature-box">
          <h3>Affordable Prices</h3>
          <p>Luxury furniture at budget-friendly rates</p>
        </div>
        <hr></hr>
        <div className="feature-box">
          <h3>Fast Delivery</h3>
          <p>Quick and safe delivery to your doorstep</p>
        </div>
      </section>

      {/* Popular PRODUCT SECTION */}
     <section className="products">
        <h2>Popular Products</h2>

        <div className="product-grid">
          {popular.map((item) => (
            <div key={item._id} className="card">
              <img src={`http://localhost:5000/productsImages/${item.pimage}`} alt={item.ptitle}/>
              <h4>{item.ptitle}</h4>
              <p>₹{item.pprice}</p>

              {/* Know BUTTON */}
              <button onClick={()=>knowMore(item._id)} className="btn">Know More</button>
              {user?.role==="admin"&&(
              <button onClick={()=>removeFromPopular(item._id)} className="btn">Remove From Popular</button>
              )}
              

            </div>
          ))}
        </div>
      </section>


      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Furniture Store | Designed with ❤️</p>
      </footer>

    </div>
  );
};

export default Home;
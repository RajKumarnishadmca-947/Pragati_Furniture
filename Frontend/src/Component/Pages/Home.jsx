import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "../CSS/Home.css";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_API_URL;

const Home = () => {
  const { user } = useContext(AuthContext);

  const [popular, setPopular] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  // ✅ Fetch Popular Products
  useEffect(() => {
    const getPopular = async () => {
      const res = await axios.get(`${url}/api/products/getproducts`);
      const filtered = res.data.filter((p) => p.isPopular);
      setPopular(filtered);
    };
    getPopular();
  }, []);

  // ✅ Next Slide
  const nextSlide = () => {
    if (popular.length <= 3) return;

    setCurrentIndex((prev) =>
      prev < popular.length - 3 ? prev + 1 : 0
    );
  };

  // ✅ Previous Slide
  const prevSlide = () => {
    if (popular.length <= 3) return;

    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : popular.length - 3
    );
  };

  // ✅ Auto Slide
  useEffect(() => {
    if (popular.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < popular.length - 3 ? prev + 1 : 0
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [popular]);

  // Know more
  const knowMore = (id) => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      navigate(`/product/${id}`);
    }
  };

  // Shop now
  const shopnow = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      navigate("/seeproducts");
    }
  };

  // Remove popular
  const removeFromPopular = async (id) => {
    try {
      await axios.put(`${url}/api/products/remove-popular/${id}`);
      const updated = popular.filter((item) => item._id !== id);
      setPopular(updated);
      toast.success("Removed from Popular");
    } catch (error) {
      toast.error("Error removing");
    }
  };

  return (
    <div className="home">

      {/* ✅ CAROUSEL */}
      {popular.length > 0 && (
        <div className="carousel">
          <div className="carousel-container">

            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 33.33}%)`,
              }}
            >
              {popular.map((item) => (
                <div key={item._id} className="carousel-slide">
                  <img
                    src={
                      item.pimage?.startsWith("http")
                        ? item.pimage
                        : `${url}/productsImages/${item.pimage}`
                    }
                    alt={item.ptitle}
                  />
                  <h4>{item.ptitle}</h4>
                  <p>₹{item.pprice}</p>
                  <button onClick={() => knowMore(item._id)}>
                    Know More
                  </button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <button className="prev" onClick={prevSlide}>❮</button>
            <button className="next" onClick={nextSlide}>❯</button>

          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>In Gorakhpur</h1>
          <h2>Elegant Furniture for Your Home</h2>
          <p>Upgrade your living space with modern and stylish furniture</p>
          <button className="shop-btn" onClick={shopnow}>Shop Now</button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-box">
          <h3>Premium Quality</h3>
          <p>Best materials with long-lasting durability</p>
        </div>
        <hr />
        <div className="feature-box">
          <h3>Affordable Prices</h3>
          <p>Luxury furniture at budget-friendly rates</p>
        </div>
        <hr />
        <div className="feature-box">
          <h3>Fast Delivery</h3>
          <p>Quick and safe delivery to your doorstep</p>
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="products">
        <h2>Popular Products</h2>

        <div className="product-grid">
          {popular.map((item) => (
            <div key={item._id} className="card">
              <img
                src={
                  item.pimage?.startsWith("http")
                    ? item.pimage
                    : `${url}/productsImages/${item.pimage}`
                }
                alt={item.ptitle}
              />
              <h4>{item.ptitle}</h4>
              <p>₹{item.pprice}</p>

              <button onClick={() => knowMore(item._id)} className="btn">
                Know More
              </button>

              {user?.role === "admin" && (
                <button
                  onClick={() => removeFromPopular(item._id)}
                  className="btn"
                >
                  Remove From Popular
                </button>
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
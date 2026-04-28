import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import OptimizedImage from "../OptimizedImage";
import bannerImage from "../../assets/banner001.jpg";

function Hero() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);

  const handleShopNow = () => {
    navigate('/new-arrivals');
  };

  const handleExplore = () => {
    navigate('/all-products');
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <section className="hero" style={{ position: 'relative' }}>
      {/* Banner Modal/Prompt */}
      {showBanner && (
        <div className="banner-modal-overlay">
          <div className="banner-modal">
            <button className="banner-close-btn" onClick={handleCloseBanner}>
              ✕
            </button>
            <img src={bannerImage} alt="Fika Banner" className="banner-modal-image" loading="lazy" />
          </div>
        </div>
      )}

      <div className="hero-heading">
        <div className="hero-heading-content">
          <h1 className="hero-main-title">
            Enter into a world of luxurious comfort and artisanal charm
          </h1>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-content-left" style={{ cursor: 'pointer' }}>
          <OptimizedImage src="./hero_image1.webp" alt="Shopping bag with products" />
        </div>

        <div className="hero-content-middle">
          <div className="button-container">
            <button className="hero-button primarybtn" onClick={handleShopNow}>
              SHOP NOW <span className="arrow">→</span>
            </button>
            <button className="hero-button secondarybtn" onClick={handleExplore}>
              EXPLORE MORE PRODUCTS
            </button>
          </div>

          <div className="brand-section">
            {/* <div className="trending-text">TRENDING</div>
            <div className="collection-text">Awesome Collection</div> */}
            <div className="brand-logo">
              <img style={{ width: "300px" }} src="/fika_page-0001.webp" alt="logo" />
            </div>
          </div>
        </div>

        <div className="hero-content-right">
          <div className="main-product-image">
            <OptimizedImage src="./hero_image2.webp" alt="Featured product" />
          </div>

          <div className="product-grid">
            <div className="product-grid-item item1 width-40">
              <div className="price-overlay"></div>
              <img src="./hero_image2_1.webp" alt="Product thumbnail" loading="lazy" />
            </div>
            <div className="product-grid-item item2 width-60">
              <img src="./hero_image2_2.webp" alt="Product thumbnail" loading="lazy" />
            </div>
            <div className="product-grid-item item3 width-60">
              <div className="collection-overlay">Blue Dreams Collection</div>
              <img src="./hero_image2_5.webp" alt="Product thumbnail" loading="lazy" />
            </div>
            <div className="product-grid-item item4 width-40">
              <img src="./hero_image2_6.webp" alt="Product thumbnail" loading="lazy" />
            </div>
            <div className="product-grid-item item5 width-40">
              <img src="./hero_image2_3.webp" alt="Product thumbnail" loading="lazy" />
            </div>
            <div className="product-grid-item item6 width-60">
              <img src="./hero_image2_4.webp" alt="Product thumbnail" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
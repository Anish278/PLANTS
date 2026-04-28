import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingCart, FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaClock, FaTag, FaGift, FaRegHeart, FaArrowRight } from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import "./NewArrivalsSection.css";
import { useAuth } from "../../context/AuthContext";
import LoginPrompt from "../../components/LoginPrompt/LoginPrompt";
import config from "../../config";
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import OptimizedImage from '../../Component/OptimizedImage';

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 11, minutes: 23, seconds: 45 });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();
  const [categoryProducts, setCategoryProducts] = useState({
    cushions: [],
    bedsets: [],
    doharsAndQuilts: [],
    wishGenie: [],
    tableLinen: [],
    bagsAndPouches: [],
    gifting: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsRowRef = useRef(null);
  const sliderRefs = {
    cushions: useRef(null),
    bedsets: useRef(null),
    doharsAndQuilts: useRef(null),
    tableLinen: useRef(null),
    bagsAndPouches: useRef(null),
    gifting: useRef(null),
    main: useRef(null)
  };

  const autoScrollTimer = useRef(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px'
        }
      }
    ]
  };

  // Fetch products from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        // Get products added in the last 30 days as new arrivals
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newProducts = products.filter(product => {
          if (!product.created_at) return true;
          const productDate = new Date(product.created_at);
          const hasImage = product.image && product.image.trim() !== '';
          return productDate >= thirtyDaysAgo && hasImage;
        });

        const sortProducts = (products) => {
          return products.sort((a, b) => {
            const stockA = Number(a.inventory) > 0 ? 1 : 0;
            const stockB = Number(b.inventory) > 0 ? 1 : 0;
            if (stockA !== stockB) {
              return stockB - stockA; // In-stock (1) before out-of-stock (0)
            }
            const dateA = a.createdAt?.toDate?.() || new Date(a.created_at || 0);
            const dateB = b.createdAt?.toDate?.() || new Date(b.created_at || 0);
            return dateB - dateA; // Newest first
          });
        };

        setNewArrivals(sortProducts(newProducts));
        // Set featured product (first item with discount or first new arrival)
        const discountedProduct = newProducts.find(product => product.discount && Number(product.inventory) > 0);
        if (discountedProduct) {
          setFeaturedProduct(discountedProduct);
        } else if (newProducts.length > 0) {
          // Fallback to first available product (ideally in stock if any)
          const firstInStock = newProducts.find(p => Number(p.inventory) > 0);
          setFeaturedProduct(firstInStock || newProducts[0]);
        }

        const categorizedProducts = {
          cushions: sortProducts(products.filter(p => (p.category?.toLowerCase() === "cushions" || p.category?.toLowerCase() === "cushion covers") && p.image && p.image.trim() !== '')),
          bedsets: sortProducts(products.filter(p => p.category?.toLowerCase() === "bedsets" && p.image && p.image.trim() !== '')),
          doharsAndQuilts: sortProducts(products.filter(p => p.category?.toLowerCase() === "dohars & quilts" && p.image && p.image.trim() !== '')),
          wishGenie: sortProducts(products.filter(p => p.category?.toLowerCase() === "wish genie" && p.image && p.image.trim() !== '')),
          tableLinen: sortProducts(products.filter(p => p.category?.toLowerCase() === "table linen" && p.image && p.image.trim() !== '')),
          bagsAndPouches: sortProducts(products.filter(p => p.category?.toLowerCase() === "bags & pouches" && p.image && p.image.trim() !== '')),
          gifting: sortProducts(products.filter(p => p.category?.toLowerCase() === "gifting" && p.image && p.image.trim() !== ''))
        };
        setCategoryProducts(categorizedProducts);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown timer for featured product
  useEffect(() => {
    let timerInterval;

    const startCountdown = () => {
      timerInterval = setInterval(() => {
        setTimeLeft(prevTime => {
          const { days, hours, minutes, seconds } = prevTime;

          if (seconds > 0) {
            return { ...prevTime, seconds: seconds - 1 };
          } else if (minutes > 0) {
            return { ...prevTime, minutes: minutes - 1, seconds: 59 };
          } else if (hours > 0) {
            return { ...prevTime, hours: hours - 1, minutes: 59, seconds: 59 };
          } else if (days > 0) {
            return { ...prevTime, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
          }

          // Reset when countdown reaches zero
          return { days: 3, hours: 11, minutes: 23, seconds: 45 };
        });
      }, 1000);
    };

    startCountdown();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []); // Empty dependency array since we only want this to run once

  // Dynamically generate categories from newArrivals
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(newArrivals.map(p => p.category).filter(Boolean)));
    // Filter out categories that have no products with images
    const categoriesWithProducts = uniqueCategories.filter(category =>
      newArrivals.some(product =>
        product.category === category &&
        product.image &&
        product.image.trim() !== ''
      )
    );
    return ['all', ...categoriesWithProducts, 'wish genie'];
  }, [newArrivals]);

  const filteredProducts = (activeTab === "all"
    ? newArrivals
    : newArrivals.filter(product => {
      const hasImage = product.image && product.image.trim() !== '';
      return product.category?.toLowerCase().trim() === activeTab.toLowerCase().trim() && hasImage;
    })).sort((a, b) => {
      // Push out of stock products to the bottom
      const stockA = Number(a.inventory) > 0 ? 1 : 0;
      const stockB = Number(b.inventory) > 0 ? 1 : 0;

      if (stockA !== stockB) {
        return stockB - stockA; // In-stock (1) before out-of-stock (0)
      }

      const dateA = a.createdAt?.toDate?.() || new Date(a.created_at || 0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.created_at || 0);
      return dateB - dateA; // Newest first
    });

  console.log('Filtered Products:', filteredProducts);
  console.log('Active Tab:', activeTab);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    // Normalize product data for cart
    const normalizedProduct = {
      ...product,
      name: product.product_name || product.name,
      price: product.mrp || product.price,
      image: product.image || '/placeholder-image.webp'
    };
    addToCart(normalizedProduct, undefined, 1, navigate);
  };

  const handleAddToWishlist = (product, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id, navigate);
    } else {
      // Normalize product data for wishlist
      const normalizedProduct = {
        ...product,
        product_name: product.product_name || product.name,
        mrp: product.mrp || product.price,
        image: product.image || '/placeholder-image.webp'
      };
      addToWishlist(normalizedProduct, navigate);
    }
  };

  const handleQuickView = (id, e) => {
    if (e) e.stopPropagation();
    navigate(`/product/${id}`);
  };

  const scrollProducts = (direction, refKey) => {
    if (sliderRefs[refKey] && sliderRefs[refKey].current) {
      if (direction === 'left') {
        sliderRefs[refKey].current.slickPrev();
      } else {
        sliderRefs[refKey].current.slickNext();
      }
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Auto scroll functionality
  useEffect(() => {
    let scrollInterval;

    if (isAutoPlay && sliderRefs.main.current) {
      scrollInterval = setInterval(() => {
        const container = sliderRefs.main.current;
        if (!container) return;

        const isAtEnd = container.slickCurrentSlide() >= (container.slickGetTotalSlides() - 1);

        if (isAtEnd) {
          container.slickGoTo(0);
        } else {
          container.slickNext();
        }
      }, 5000);
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isAutoPlay]); // Only re-run when isAutoPlay changes

  // Format price with discount
  const formatPrice = (price, discount) => {
    if (discount) {
      const discountedPrice = Number(price) * (1 - discount / 100);
      return discountedPrice.toFixed(2);
    }
    return Number(price).toFixed(2);
  };

  // Calculate original price display
  const getOriginalPrice = (price) => {
    return Number(price).toFixed(2);
  };

  // Newsletter submit handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    axios.post(`${config.API_URL}/api/newsletter`, { email: newsletterEmail })
      .then(() => {
        setNewsletterSuccess(true);
        setNewsletterEmail("");
        setTimeout(() => setNewsletterSuccess(false), 3000);
      })
      .catch(err => {
        console.error('Newsletter subscription error:', err);
        alert("Error: " + (err.response?.data?.error || err.message));
      });
  };

  // Optimize image loading with error handling
  const handleImageError = (e, fallbackImage = '/placeholder-image.webp') => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = fallbackImage;
  };

  // Helper to get the first image from the comma-separated image field
  const getFirstImage = (imageField) => {
    if (!imageField) return '/placeholder-image.webp';
    const imagesArr = imageField.split(',').map(img => img.trim()).filter(Boolean);
    if (imagesArr.length > 0) {
      return imagesArr[0].startsWith('/') ? imagesArr[0] : `/${imagesArr[0]}`;
    }
    return '/placeholder-image.webp';
  };

  // Render product card with optimized image loading
  const renderProductCard = (product) => {
    let displayName = product.product_name || "";
    let subtitle = "";
    const match = displayName.match(/^(.*?)\s*(\(.*\))$/);
    if (match) {
      displayName = match[1];
      subtitle = match[2];
    }
    return (
      <div
        key={product.id}
        className="product-card"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="product-image-container arrivals-product-image">
          <OptimizedImage
            src={getFirstImage(product.image)}
            alt={product.product_name}
            className={`product-img ${product.inventory <= 0 ? 'out-of-stock-image' : ''}`}
          />
          {product.inventory <= 0 && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
          <div className="views-overlay" title="Views">
            <img src="/Eye3.png" alt="views" className="views-icon-img" />
            <span>{product.views || 0}</span>
          </div>

          <div className="product-actions">
            <button
              className="product-action-btn cart-btn"
              onClick={(e) => handleAddToCart(product, e)}
              title="Add to Cart"
              disabled={product.inventory <= 0}
            >
              <FaShoppingCart />
            </button>
            <button
              className={`product-action-btn wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={(e) => handleAddToWishlist(product, e)}
              title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button
              className="product-action-btn quickview-btn"
              onClick={(e) => handleQuickView(product.id, e)}
              title="Quick View"
            >
              <FaEye />
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{displayName}</h3>
          {subtitle && <div className="product-subtitle">{subtitle}</div>}
          <p className="product-category">
            {product.category}
          </p>
          <div className="product-price">
            <span className="current-price">
              ₹{Number(product.mrp).toFixed(2)}
            </span>
          </div>

          <button className="shop-now-btn">
            Shop Now <FaArrowRight className="" />
          </button>
        </div>
      </div>
    );
  };

  // Render products container - reusable component for product sections
  const renderProductsContainer = (title, products, refKey, customTitle = null) => {
    // If no products, don't render the section
    if (!products || products.length === 0) return null;

    return (
      <div className="arrivals-category-section">
        <div className="arrivals-category-header">
          <h2 className="arrivals-category-title">{customTitle || title}</h2>
          <Link to={`/all-products?category=${title.toLowerCase().replace(/\s+/g, '-')}`} className="arrivals-view-category">
            View All <span className="arrivals-arrow-circle">&#8599;</span>
          </Link>
        </div>

        <div className="arrivals-products-container">
          <button
            className="arrivals-scroll-button left"
            onClick={() => scrollProducts('left', refKey)}
          >
            <FaChevronLeft />
          </button>

          <Slider ref={sliderRefs[refKey]} {...sliderSettings} className="arrivals-products-row">
            {products.map(product => renderProductCard(product))}
          </Slider>

          <button
            className="arrivals-scroll-button right"
            onClick={() => scrollProducts('right', refKey)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    );
  };

  const handleCategoryClick = (category) => {
    if (category.toLowerCase() === 'wish genie') {
      navigate('/new-arrivals-wish');
    } else {
      setActiveTab(category);
    }
  };

  if (loading) {
    console.log('Loading state:', loading);
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    console.error('Error state:', error);
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <div className="arrivals-section">
        {/* Introduction Section */}
        <div className="arrivals-intro">
          <div className="arrivals-intro-content">
            <h1 className="arrivals-title">Discover Fresh Styles</h1>
            <p className="arrivals-description">
              Explore our latestcollection in home décor, stylish mens shirts, and scented candles fresh arrivals for you and your space
            </p>
            <div className="arrivals-features">
              <div className="arrivals-feature-item">
                <FaTag className="arrivals-feature-icon" />
                <span>Exclusive Designs</span>
              </div>
              <div className="arrivals-feature-item">
                <FaClock className="arrivals-feature-icon" />
                <span>Limited Time Offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Product Highlight */}
        {featuredProduct && (
          <div className="arrivals-featured-product">
            <div
              className="arrivals-featured-image"
              onClick={() => navigate(`/product/${featuredProduct.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={getFirstImage(featuredProduct.image)} alt={featuredProduct.product_name} />
              {/* {featuredProduct.discount && (
                <div className="arrivals-featured-discount">
                  <span>{featuredProduct.discount}% OFF</span>
                </div>
              )} */}
            </div>
            <div className="arrivals-featured-info">
              <div className="arrivals-limited-offer">
                <h3>Limited Time Offer</h3>
                <div className="arrivals-countdown">
                  <div className="arrivals-time-block">
                    <span className="arrivals-time-value">{timeLeft.days}</span>
                    <span className="arrivals-time-label">Days</span>
                  </div>
                  <div className="arrivals-time-separator">:</div>
                  <div className="arrivals-time-block">
                    <span className="arrivals-time-value">{timeLeft.hours}</span>
                    <span className="arrivals-time-label">Hours</span>
                  </div>
                  <div className="arrivals-time-separator">:</div>
                  <div className="arrivals-time-block">
                    <span className="arrivals-time-value">{timeLeft.minutes}</span>
                    <span className="arrivals-time-label">Min</span>
                  </div>
                  <div className="arrivals-time-separator">:</div>
                  <div className="arrivals-time-block">
                    <span className="arrivals-time-value">{timeLeft.seconds}</span>
                    <span className="arrivals-time-label">Sec</span>
                  </div>
                </div>
              </div>
              <h2 className="arrivals-featured-title">{featuredProduct.product_name}</h2>
              <p className="arrivals-featured-description">
                {featuredProduct.description || "Experience premium quality and exceptional design with this must-have piece from our latest collection."}
              </p>
              <div className="arrivals-featured-pricing">
                {featuredProduct.discount ? (
                  <>
                    <span className="arrivals-current-price">₹{formatPrice(featuredProduct.mrp, featuredProduct.discount)}</span>
                    <span className="arrivals-original-price">₹{getOriginalPrice(featuredProduct.mrp)}</span>
                  </>
                ) : (
                  <span className="arrivals-current-price">₹{getOriginalPrice(featuredProduct.mrp)}</span>
                )}
              </div>
              <div className="arrivals-featured-actions">
                <button
                  className="arrivals-cart-btn"
                  onClick={(e) => handleAddToCart(featuredProduct, e)}
                >
                  Add to Cart
                </button>
                <button
                  className={`arrivals-wishlist-btn ${isInWishlist(featuredProduct.id) ? 'active' : ''}`}
                  onClick={(e) => handleAddToWishlist(featuredProduct, e)}
                >
                  <FaHeart /> {isInWishlist(featuredProduct.id) ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Arrivals Section Header */}
        <div className="arrivals-header">
          <h2 className="arrivals-section-title">NEW ARRIVALS</h2>
          <button className="arrivals-carousel-control" onClick={toggleAutoScroll}>
            {isAutoPlay ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 9V15M14 9V15M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16.5L16 12L10 7.5V16.5Z" fill="#222" />
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Category Selection */}
        <div className="arrivals-category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`arrivals-category-tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="arrivals-category-description">
          <p>
            {activeTab === "all"
              ? "Browse our complete selection of new arrivals, featuring the latest trends and must-have pieces for the season."
              : activeTab === "cushions"
                ? "Discover our newest cushions, from elegant designs to casual essentials, all crafted with premium fabrics."
                : activeTab === "bedsets"
                  ? "Complete your look with our just-arrived bedsets, including covers, sheets, and more."
                  : activeTab === "wish genie"
                    ? "Explore our magical collection of Wish Genie products, designed to make your wishes come true."
                    : activeTab.toLowerCase() === "table linen"
                      ? "Elevate your dining experience with our premium table linen collection, featuring elegant tablecloths, runners, and napkins."
                      : "Explore our collection of dohars and quilts, perfect for every season and crafted with premium materials for ultimate comfort."}
          </p>
        </div>

        {/* New Arrivals Products Container */}
        <div className="arrivals-products-container">
          <button className="arrivals-scroll-button left" onClick={() => scrollProducts('left', 'main')}>
            <FaChevronLeft />
          </button>

          <Slider ref={sliderRefs.main} {...sliderSettings} className="arrivals-products-row">
            {filteredProducts.map(product => renderProductCard(product))}
          </Slider>

          <button className="arrivals-scroll-button right" onClick={() => scrollProducts('right', 'main')}>
            <FaChevronRight />
          </button>
        </div>

        {/* Category-specific product sections */}
        <div className="arrivals-sections-container">
          {/* Cushions */}
          {renderProductsContainer("Cushion Covers", categoryProducts.cushions, "cushions")}

          {/* Bedsets */}
          {renderProductsContainer("Bedsets", categoryProducts.bedsets, "bedsets")}

          {/* Dohars and Quilts */}
          {renderProductsContainer("Dohars & Quilts", categoryProducts.doharsAndQuilts, "doharsAndQuilts")}

          {/* Table Linen */}
          {renderProductsContainer("Table Linen", categoryProducts.tableLinen, "tableLinen")}

          {/* Bags & Pouches */}
          {renderProductsContainer("Bags & Pouches", categoryProducts.bagsAndPouches, "bagsAndPouches")}

          {/* Gifting */}
          {renderProductsContainer("Gifting", categoryProducts.gifting, "gifting", "Luxury Scented Candles & Home Decor Gifts")}
        </div>

        {/* Shopping Benefits */}
        <div className="arrivals-benefits">
          {/* <div className="arrivals-benefit-item">
            <div className="arrivals-benefit-icon">🚚</div>
            <div className="arrivals-benefit-content">
              <h3>Free Shipping</h3>
              <p>On all orders over ₹1499</p>
            </div>
          </div> */}
          <div className="arrivals-benefit-item">
            <div className="arrivals-benefit-icon">⭐</div>
            <div className="arrivals-benefit-content">
              <h3>Quality Guarantee</h3>
              <p>Crafted with premium materials</p>
            </div>
          </div>
          <div className="arrivals-benefit-item">
            <div className="arrivals-benefit-icon">🔄</div>
            <div className="arrivals-benefit-content">
              <h3>Easy Returns</h3>
              <p>Easy return policy</p>
            </div>
          </div>
          <div className="arrivals-benefit-item">
            <div className="arrivals-benefit-icon">💳</div>
            <div className="arrivals-benefit-content">
              <h3>Secure Payment</h3>
              <p>Multiple payment options</p>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="arrivals-view-all">
          <Link to="/all-products" className="arrivals-view-all-btn">
            View All Collections
            <span className="arrivals-arrow-circle">&#8599;</span>
          </Link>
        </div>

        {/* Newsletter Signup */}
        <div className="arrivals-newsletter">
          <div className="arrivals-newsletter-content">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for exclusive offers and early access to new arrivals</p>
            <form className="arrivals-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterSuccess && <div style={{ color: 'green', marginTop: 8 }}>Subscribed successfully!</div>}
          </div>
        </div>
      </div>

      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to add items to your cart or wishlist." />
          </div>
        </div>
      )}
    </>
  );
};

export default NewArrivals;

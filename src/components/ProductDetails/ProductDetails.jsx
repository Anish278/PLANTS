

import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBackNavigation } from "../../utils/navigationUtils.js";
import {
  FaShoppingCart,
  FaHeart,
  FaArrowLeft,
  FaShare,
  FaStar,
  FaStarHalf,
  FaEye,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaTag,
  FaInstagram,
  FaPinterest,
  FaTwitter,
  FaFacebook,
  FaUsers,
  FaShoppingBag,
  FaArrowRight,
  FaRegHeart,
  FaCheckCircle,
} from "react-icons/fa";
import {
  IoWaterOutline,
  IoSunnyOutline,
  IoPawOutline,
  IoLeafOutline,
  IoShieldCheckmarkOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import "./ProductDetails.css";
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from '../LoginPrompt/LoginPrompt';
import { db } from "../../firebase/config";
import { collection, getDocs, query, where, orderBy, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth } from '../../firebase/config';
import { incrementProductViews, initializeProductFields, incrementProductBought } from '../../firebase/firestore';
import OptimizedImage from '../../Component/OptimizedImage';

const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
};

const formatPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '₹0.00';
  return `₹${numPrice.toFixed(2)}`;
};

const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  if (!discountPercentage || discountPercentage <= 0) return originalPrice;
  return originalPrice * (1 - discountPercentage / 100);
};

const formatPriceWithDiscount = (price, discount) => {
  const originalPrice = Number(price) || 0;
  const discountPercentage = Number(discount) || 0;

  if (!discountPercentage || discountPercentage <= 0) {
    return {
      original: null,
      discounted: originalPrice.toFixed(2),
      discountPercentage: 0
    };
  }

  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage);

  return {
    original: originalPrice.toFixed(2),
    discounted: discountedPrice.toFixed(2),
    discountPercentage: discountPercentage
  };
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goBack } = useBackNavigation();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState("Small");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorError, setColorError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [pincodeError, setPincodeError] = useState('');
  const galleryRef = useRef(null);
  const wrapperRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [dynamicTestimonials, setDynamicTestimonials] = useState([]);

  useEffect(() => {
    const fetchDynamicTestimonials = async () => {
      try {
        const testimonialsRef = collection(db, 'testimonials');
        const q = query(
          testimonialsRef,
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDynamicTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials in ProductDetails:", error);
      }
    };

    fetchDynamicTestimonials();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        let productDoc = null;
        let raw = null;

        if (!isNaN(parseInt(id))) {
          const q = query(productsRef, where('id', '==', parseInt(id)));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            productDoc = querySnapshot.docs[0];
            raw = productDoc.data();
          }
        }

        if (!productDoc) {
          try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              productDoc = docSnap;
              raw = productDoc.data();
            }
          } catch (e) {
            console.log('Error fetching by document ID:', e);
          }
        }

        if (!productDoc) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        const normalized = {
          ...raw,
          id: productDoc.id,
          image: raw.image || '/placeholder-image.webp',
          reviews: raw.reviews || [],
          reviewsCount: raw.reviewsCount || 0,
          discount: raw.discount || 0,
          isNew: raw.isNew || false,
          sizes: raw.sizes || [],
          rating: raw.rating || 4.5,
          mrp: Number(raw.mrp) || 0,
          inventory: raw.inventory || 0,
          product_name: raw.product_name || '',
          category: raw.category || '',
        };
        setProduct(normalized);
        setCurrentPrice(Number(normalized.mrp) || 0);

        try {
          await initializeProductFields(id);
          await incrementProductViews(id);
        } catch (error) {
          console.error('Error handling product engagement:', error);
        }

        const relatedQuery = query(
          productsRef,
          where('category', '==', raw.category)
        );
        const relatedSnapshot = await getDocs(relatedQuery);
        const related = relatedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product && product.image) {
      const imagesArr = product.image
        .split(',')
        .map(img => img.trim())
        .filter(Boolean)
        .map(img => {
          if (img.startsWith('http') || img.startsWith('https') || img.startsWith('/')) {
            return img;
          }
          return `/${img}`;
        });
      setProductImages(imagesArr.length > 0 ? imagesArr : ['/placeholder-image.webp']);
    } else {
      setProductImages(['/placeholder-image.webp']);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    const productToAdd = {
      id: product.id,
      name: product.product_name,
      price: currentPrice,
      discount: product.discount || 0,
      image: product.image || '/placeholder-image.webp',
      category: product.category,
      size: selectedSize,
      quantity: quantity,
      selected: true,
      addedAt: new Date().toISOString()
    };

    try {
      await addToCart(productToAdd, selectedSize, quantity, navigate);
      await incrementProductBought(id);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handlePincodeCheck = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      setDeliveryDate(null);
      return;
    }
    setPincodeError('');
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 5);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    setDeliveryDate(delivery.toLocaleDateString('en-IN', options));
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`} />);
    }
    return stars;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-details-container">
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to add items to your cart or wishlist." />
          </div>
        </div>
      )}

      <div className="product-details-wrapper">
        <div className="product-gallery">
          <div className="main-image-container">
            <img src={productImages[selectedImage]} alt={product.product_name} className="main-image" />
          </div>
          <div className="thumbnail-slider">
            {productImages.length > 3 && (
              <button
                className="thumb-arrow thumb-arrow-left"
                onClick={() => {
                  if (thumbnailContainerRef.current) {
                    thumbnailContainerRef.current.scrollBy({ left: -90, behavior: 'smooth' });
                  }
                }}
              >
                ‹
              </button>
            )}
            <div className="thumbnail-row" ref={thumbnailContainerRef}>
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
            {productImages.length > 3 && (
              <button
                className="thumb-arrow thumb-arrow-right"
                onClick={() => {
                  if (thumbnailContainerRef.current) {
                    thumbnailContainerRef.current.scrollBy({ left: 90, behavior: 'smooth' });
                  }
                }}
              >
                ›
              </button>
            )}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">
              {product.scientificName ? (
                <>
                  <span className="scientific-name">{product.scientificName}</span>
                  <span className="common-name"> ({product.product_name})</span>
                </>
              ) : (
                product.product_name
              )}
            </h1>
            <div className="rating-row">
              <div className="stars">{renderStars(product.rating)}</div>
              <span className="review-count">{product.reviewsCount} verified reviews</span>
            </div>
          </div>

          <div className="price-card">
            <div className="price-row">
              <span className="current-price">₹{calculateDiscountedPrice(product.mrp, product.discount)}</span>
              {product.discount > 0 && (
                <span className="mrp">₹{product.mrp}</span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="discount-badge">Save {product.discount}% Today</span>
            )}
          </div>

          <div className="selection-section">
            <h3>Select Plant Size</h3>
            <div className="size-options">
              {["Small", "Medium", "Large"].map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="delivery-card">
            <h3>Check Delivery Availability</h3>
            <div className="pincode-input-wrapper">
              <input 
                type="text" 
                placeholder="Enter 6-digit Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
              />
              <button onClick={handlePincodeCheck}>CHECK</button>
            </div>
            {deliveryDate && (
              <p className="delivery-info">
                <FaTruck /> Estimated delivery by {deliveryDate}
              </p>
            )}
            {pincodeError && <p className="error-text">{pincodeError}</p>}
          </div>

          <div className="action-buttons">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
            <button className="buy-now-btn" onClick={handleAddToCart}>BUY NOW</button>
          </div>

          <div className="product-extra-info">
            <div className="info-section">
              <h3>About The Product</h3>
              <p>{product.product_description}</p>
              <div className="product-features-grid">
                <div className="feature">
                  <IoWaterOutline />
                  <span>Water twice a week</span>
                </div>
                <div className="feature">
                  <IoSunnyOutline />
                  <span>Bright indirect sunlight</span>
                </div>
                <div className="feature">
                  <IoPawOutline />
                  <span>Pet Friendly Choice</span>
                </div>
                <div className="feature">
                  <IoLeafOutline />
                  <span>Easy Care for Beginners</span>
                </div>
              </div>
            </div>

            <div className="info-section what-in-box">
              <h3>What's in the Box</h3>
              <ul>
                <li><FaCheckCircle /> Healthy {product.product_name}</li>
                <li><FaCheckCircle /> Premium 4-6" Nursery Pot</li>
                <li><FaCheckCircle /> Nutrient-rich Potting Mix</li>
                <li><FaCheckCircle /> Detailed Care Guide</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

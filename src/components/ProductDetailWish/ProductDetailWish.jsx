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
} from "react-icons/fa";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import "./ProductDetailWish.css";
import { useAuth } from '../../context/AuthContext';
import LoginPrompt from '../LoginPrompt/LoginPrompt';
import { getWishGenieProduct, getWishGenieProducts, incrementWishGenieViews, incrementWishGenieBought, initializeWishGenieFields } from '../../firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';

const formatPrice = (price) => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '₹0.00';
  return `₹${numPrice.toFixed(2)}`;
};

const ProductDetailWish = () => {
  const navigate = useNavigate();
  const { goBack } = useBackNavigation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, wishlist: contextWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const galleryRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getWishGenieProduct(id);
        
        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Increment view count for this Wish Genie product
        console.log('Incrementing views for Wish Genie product:', id);
        try {
          // First initialize the fields if they don't exist
          await initializeWishGenieFields(id);
          
          // Then increment the views
          await incrementWishGenieViews(id);
          console.log('Successfully incremented views for Wish Genie product:', id);
          
          // Fetch the updated product data to get the new view count
          const updatedProductData = await getWishGenieProduct(id);
          if (updatedProductData) {
            console.log('Updated product data:', updatedProductData);
            console.log('Views field:', updatedProductData.views);
            console.log('Bought field:', updatedProductData.bought);
            setProduct(updatedProductData);
          } else {
            setProduct(productData);
          }
        } catch (error) {
          console.error('Error incrementing Wish Genie views:', error);
          setProduct(productData);
        }

        // Fetch related products
        const allProducts = await getWishGenieProducts();
        const related = allProducts
          .filter(p => p.Category === productData.Category && p.id !== id)
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
    const handleScroll = () => {
      if (galleryRef.current && wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const galleryRect = galleryRef.current.getBoundingClientRect();
        
        if (wrapperRect.top <= 0 && wrapperRect.bottom >= galleryRect.height) {
          const translateY = -wrapperRect.top;
          galleryRef.current.style.transform = `translateY(${translateY}px)`;
        } else if (wrapperRect.top > 0) {
          galleryRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time listener for product updates
  useEffect(() => {
    if (!id) return;

    const productRef = doc(db, 'wish_genie', id);
    
    const unsubscribe = onSnapshot(productRef, (doc) => {
      if (doc.exists()) {
        const updatedData = { id: doc.id, ...doc.data() };
        console.log('Real-time update received:', updatedData);
        console.log('New views count:', updatedData.views);
        console.log('New bought count:', updatedData.bought);
        
        // Update product state with real-time data
        setProduct(prevProduct => {
          if (prevProduct) {
            return { ...prevProduct, ...updatedData };
          }
          return updatedData;
        });
      }
    }, (error) => {
      console.error('Error in real-time listener:', error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // Check if product is in stock
    if (product.inventory && product.inventory <= 0) {
      alert('This product is currently out of stock.');
      return;
    }

    // Check if requested quantity is available
    if (product.inventory && quantity > product.inventory) {
      alert(`Only ${product.inventory} items available in stock.`);
      return;
    }

    // Normalize product fields for cart
    const productToAdd = {
      id: product.id,
      name: product['Sticker Content Main'] || product.name || product.product_name || 'Product',
      price: Number(product.MRP) || Number(product.price) || 0,
              image: product.image || '/placeholder-image.webp',
      category: product.Category || product.category || '',
      quantity: quantity,
      discount: Number(product.discount) || 0,
      color: product.color || 'Default',
      product_code: product['Product code'] || product.product_code || '',
    };
    addToCart(productToAdd);
    
    // Increment bought count when product is added to cart
    try {
      await incrementWishGenieBought(id);
      console.log('Successfully incremented bought count for Wish Genie product:', id);
    } catch (error) {
      console.error('Error incrementing Wish Genie bought count:', error);
    }
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 1000);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    addToWishlist(product);
  };

  const handleQuickView = (productId, e) => {
    e.stopPropagation();
    navigate(`/product-wish/${productId}`);
  };

  const handleRelatedProductAction = async (e, action, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    if (action === 'cart') {
      // Normalize product fields for cart
      const productToAdd = {
        id: product.id,
        name: product['Sticker Content Main'] || product.name || product.product_name || 'Product',
        price: Number(product.MRP) || Number(product.price) || 0,
        image: product.image || '/placeholder-image.webp',
        category: product.Category || product.category || '',
        quantity: 1,
        discount: Number(product.discount) || 0,
        color: product.color || 'Default',
        product_code: product['Product code'] || product.product_code || '',
      };
      addToCart(productToAdd);
      
      // Increment bought count when related product is added to cart
      try {
        await incrementWishGenieBought(product.id);
        console.log('Successfully incremented bought count for related Wish Genie product:', product.id);
      } catch (error) {
        console.error('Error incrementing related Wish Genie product bought count:', error);
      }
    } else if (action === 'wishlist') {
      addToWishlist(product);
    }
  };



  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => goBack('/new-arrivals-wish')} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => goBack('/new-arrivals-wish')} className="back-button">
          ← Back to Products
        </button>
      </div>
    );
  }

  // Get all images from the comma-separated image field
  const productImages = product.image
    ? product.image.split(',').map(img => img.trim()).filter(Boolean).map(img => {
        if (img.startsWith('http') || img.startsWith('https') || img.startsWith('/')) {
          return img;
        }
        return `/${img}`;
      })
    : ['/placeholder-image.webp'];

  const ProductGallery = ({ images }) => {
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { left, top, width, height } =
          containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setMagnifierPosition({ x, y });
      }
    };

    return (
      <div className="product-gallery">
        <div className="thumbnail-column">
          {images.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? "active" : ""}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={img} alt={`Product thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="main-image-container" ref={containerRef}>
          <img
            src={images[selectedImage]}
            alt="Selected product"
            className="main-image"
          />
          <div className="magnifier-container" onMouseMove={handleMouseMove}>
            <div
              className="magnified-view"
              style={{
                left: `${magnifierPosition.x}%`,
                top: `${magnifierPosition.y}%`,
                transform: "translate(-50%, -50%)",
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                backgroundSize: "400%",
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="product-details-container">
      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginPrompt message="Please login to add items to your cart or wishlist." />
          </div>
        </div>
      )}

      <div className="product-details-wrapper" ref={wrapperRef}>
        <div className="product-gallery" ref={galleryRef}>
          <ProductGallery images={productImages} />
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product['Sticker Content Main']}</h1>
            <p className="product-subtitle">{product['Sticker Content Sub']}</p>
          </div>

          <div className="product-price">
            <div className="price-row">
              <span className="current-price">₹{product.MRP}</span>
              <span className="stock-status">
                {product.inventory !== undefined && product.inventory !== null ? (
                  product.inventory > 0 ? (
                    <span className="in-stock"> • In Stock</span>
                  ) : (
                    <span className="out-of-stock"> • Out of Stock</span>
                  )
                ) : (
                  <span className="in-stock"> • In Stock</span>
                )}
              </span>
            </div>
          </div>

          <div className="product-features">
            <div className="feature-item">
              <FaUndo />
              <span>Easy Return Policy</span>
            </div>
            <div className="feature-item">
              <FaShieldAlt />
              <span>Secure Payment</span>
            </div>
            <div className="feature-item">
              <FaTruck />
              <span>Free Shipping Available</span>
            </div>
            <div className="feature-item">
              <FaTag />
              <span>Best Price Guaranteed</span>
            </div>
          </div>

          <div className="main-cart-section">
            <div className="quantity-selection">
              <h3>Select Quantity</h3>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={product.inventory && quantity >= product.inventory}
                >
                  +
                </button>
              </div>
            </div>

            <div className="main-cart-actions">
              <button
                className="main-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.inventory && product.inventory <= 0}
              >
                <FaShoppingCart /> ADD TO CART - ₹{product.MRP * quantity}
              </button>
              <button
                className={`main-wishlist-btn ${contextWishlist.includes(product.id) ? "in-wishlist" : ""}`}
                onClick={handleAddToWishlist}
              >
                <FaHeart />
              </button>
            </div>

            <div className="social-share">
              <h3>Share this product</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><FaFacebook /></a>
                <a href="#" className="social-icon"><FaTwitter /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
                <a href="#" className="social-icon"><FaPinterest /></a>
              </div>
            </div>
          </div>

          {showSuccessMessage && (
            <div className="success-message">
              Product added to cart successfully!
            </div>
          )}
        </div>
      </div>

      <div className="product-tabs-section">
        <div className="product-tabs">
          <div className="tab-buttons">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={activeTab === "details" ? "active" : ""}
              onClick={() => setActiveTab("details")}
            >
              Specifications
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description">
                <p>{product['Product Description']}</p>
                {product['Burning Instructions'] && (
                  <>
                    <h4 style={{marginTop: '24px', color: 'var(--text-dark)'}}>Burning Instructions</h4>
                    <p>{product['Burning Instructions']}</p>
                  </>
                )}
              </div>
            )}
            {activeTab === "details" && (
              <div className="details">
                <div className="details-section">
                  <h4>Product Information</h4>
                  <ul>
                    <li><span>Product Code</span> <strong>{product['Product code']}</strong></li>
                    <li><span>Category</span> <strong>{product.Category}</strong></li>
                    <li><span>Burn Time</span> <strong>{product['Burn Time']}</strong></li>
                    <li><span>Dimensions</span> <strong>{product['Height Dimensions']}</strong></li>
                    <li><span>Diameter</span> <strong>{product.Diameter}</strong></li>
                    <li><span>Fragrances</span> <strong>{product.Fragrances}</strong></li>
                  </ul>
                </div>
                <div className="details-section">
                  <h4>Additional Details</h4>
                  <ul>
                    <li><span>Jar Type</span> <strong>{product['Jar type']}</strong></li>
                    <li><span>Type of Wax</span> <strong>{product['Type of wax']}</strong></li>
                    <li><span>Wax Color</span> <strong>{product['Wax color']}</strong></li>
                    <li><span>Weight</span> <strong>{product['Weight']}</strong></li>
                    <li><span>Storage</span> <strong>{product['Storage']}</strong></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="related-product-card">
              <div className="related-product-image">
                <img src={relatedProduct.image} alt={relatedProduct['Sticker Content Main']} />
                <div className="product-actions">
                  <button
                    className={`action-btn wishlist-btn ${
                      contextWishlist.includes(relatedProduct.id) ? "active" : ""
                    }`}
                    onClick={(e) => handleRelatedProductAction(e, 'wishlist', relatedProduct)}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className="action-btn add-to-cart-btn"
                    onClick={(e) => handleRelatedProductAction(e, 'cart', relatedProduct)}
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
              <div className="related-product-info">
                <h3>{relatedProduct['Sticker Content Main']}</h3>
                <div className="product-price">
                  <span className="current-price" style={{fontSize: '1.1rem'}}>₹{relatedProduct.MRP}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailWish;
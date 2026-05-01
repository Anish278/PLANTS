import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaShoppingCart, FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import OptimizedImage from '../../Component/OptimizedImage';
import './ProductCard.css';

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  navigatePath
}) => {
  const navigate = useNavigate();

  let displayName = product.product_name || product.name || "";

  const mrp = Number(product.mrp || product.price || 0);
  const discount = Number(product.discount || 0);
  const finalPrice = discount > 0 ? mrp * (1 - discount / 100) : mrp;

  const handleClick = () => {
    navigate(navigatePath || `/product/${product.id}`);
  };

  return (
    <div className="modern-card" onClick={handleClick}>
      {/* Top Section */}
      <div className="modern-card-top">
        <div className="views-badge">
          <FaEye /> {product.views || 0}
        </div>
        {discount > 0 && (
          <span className="badge">{Math.round(discount)}% OFF</span>
        )}

        <OptimizedImage
          src={product.firstImage || product.image}
          alt={displayName}
          className="product-img"
        />
      </div>

      {/* Bottom Section */}
      <div className="modern-card-body">
        <p className="category">
          {product.category}
        </p>

        <h3 className="title">{displayName}</h3>

        <div className="price">
          <span className="new">₹{finalPrice.toFixed(0)}</span>
          {discount > 0 && (
            <span className="old">₹{mrp.toFixed(0)}</span>
          )}
        </div>

        <div className="card-actions">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            title="Add to Cart"
          >
            <FaShoppingCart />
          </button>
          <button
            className={isInWishlist ? "active" : ""}
            onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
            title="Wishlist"
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <button className="cta">
          Shop Now <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

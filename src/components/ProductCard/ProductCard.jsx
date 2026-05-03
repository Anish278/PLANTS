import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaLeaf } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Unified price logic — handle both discountPrice (absolute) and discount (percentage)
  const originalPrice = Number(product.price || product.mrp || 0);
  let salePrice = originalPrice;
  let discountPct = 0;

  if (product.discountPrice && Number(product.discountPrice) < originalPrice) {
    salePrice = Number(product.discountPrice);
    discountPct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  } else if (Number(product.discount) > 0) {
    discountPct = Number(product.discount);
    salePrice = Math.round(originalPrice * (1 - discountPct / 100));
  }

  const hasDiscount = discountPct > 0 && salePrice < originalPrice;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    // Login check — redirect if not logged in
    if (!user) {
      toast.info('Cart mein add karne ke liye pehle login karo! 👋');
      navigate('/login');
      return;
    }

    const productData = {
      id: product.id,
      plantName: product.plantName || product.product_name,
      name: product.plantName || product.product_name,
      price: originalPrice,
      discountPrice: hasDiscount ? salePrice : undefined,
      discount: discountPct,
      image: product.imageUrls?.[0] || product.image?.split(',')[0],
      imageUrls: product.imageUrls,
      category: product.category,
    };
    try {
      await addToCart(productData);
      toast.success(`✅ ${product.plantName || product.product_name} cart mein add ho gaya!`);
    } catch (err) {
      toast.error('Cart mein add nahi hua. Dobara try karo.');
    }
  };

  return (
    <div
      className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative p-2"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
            SALE {discountPct}%
          </span>
        )}
        {product.featured && (
          <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
            Best Seller
          </span>
        )}
        {product.isAirPurifying && (
          <span className="bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-widest">
            <FaLeaf size={8} /> Air Purifying
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-[1.8rem] bg-gray-50">
        <img
          src={product.imageUrls?.[0] || product.image?.split(',')[0]}
          alt={product.plantName || product.product_name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-2xl flex items-center justify-center gap-2 hover:bg-accent transition-colors"
          >
            <FaShoppingCart size={12} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar size={10} />
            <span className="text-[10px] font-bold text-gray-400">4.9</span>
          </div>
        </div>

        <h3 className="text-base font-display font-bold text-primary mb-1 line-clamp-1 group-hover:text-accent transition-colors">
          {product.plantName || product.product_name}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-[8px] font-bold uppercase">
            <FaLeaf size={8} /> Fresh
          </div>
          <p className="text-[10px] text-gray-400 font-medium">100+ bought recently</p>
        </div>

        {/* Price: sale price first, then original crossed out */}
        <div className="mt-auto flex items-baseline gap-2 flex-wrap">
          {originalPrice > 0 ? (
            hasDiscount ? (
              <>
                <span className="text-xl font-display font-black text-primary">₹{salePrice}</span>
                <span className="text-sm text-gray-400 line-through font-semibold">₹{originalPrice}</span>
              </>
            ) : (
              <span className="text-xl font-display font-black text-primary">₹{originalPrice}</span>
            )
          ) : (
            <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded">
              Price on Request
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

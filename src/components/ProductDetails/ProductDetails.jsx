import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, getDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuthRedirect } from '../../utils/authUtils';
import { toast } from 'react-toastify';
import {
  FaShoppingCart, FaHeart, FaTruck, FaShieldAlt,
  FaStar, FaChevronRight, FaPlus, FaMinus, FaLeaf, FaUndo, FaGift
} from "react-icons/fa";
import ProductCard from "../ProductCard/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { requireAuth, setShowLoginPrompt } = useAuthRedirect();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedBundle, setSelectedBundle] = useState(1); // 1, 2, or 3
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        let data = null;
        if (docSnap.exists()) {
          data = { id: docSnap.id, ...docSnap.data() };
        } else {
          const q = query(collection(db, 'products'), where('id', '==', parseInt(id)));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            data = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          }
        }

        if (data) {
          setProduct(data);
          const relatedQ = query(
            collection(db, 'products'),
            where('category', '==', data.category),
            limit(4)
          );
          const relatedSnap = await getDocs(relatedQ);
          setRelatedProducts(relatedSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== data.id));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="pt-40 pb-20 flex justify-center items-center min-h-[60vh] bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="text-primary font-bold animate-pulse tracking-widest text-xs">Unboxing Nature...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="pt-40 pb-20 text-center bg-cream min-h-screen">
      <h2 className="text-3xl font-display font-black text-primary">Product not found</h2>
      <button onClick={() => navigate('/all-products')} className="mt-8 bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl">
        Explore Collection
      </button>
    </div>
  );

  const images = product.imageUrls || (product.image ? product.image.split(',') : []);
  const isWishlisted = isInWishlist(product.id);
  // Unified price logic — handle both discountPrice (absolute) and discount (%)
  const originalPrice = Number(product.price || product.mrp || product.MRP || 0);
  let finalPrice = originalPrice;
  let discountPercent = 0;

  if (product.discountPrice && Number(product.discountPrice) < originalPrice) {
    // e.g. price: 799, discountPrice: 248
    finalPrice = Number(product.discountPrice);
    discountPercent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  } else if (Number(product.discount) > 0) {
    // e.g. price: 1000, discount: 20 (%)
    discountPercent = Number(product.discount);
    finalPrice = Math.round(originalPrice * (1 - discountPercent / 100));
  }

  const isOutOfStock = (product.inventory !== undefined && product.inventory !== null) ? Number(product.inventory) <= 0 : false;
  const getBundlePrice = (qty) => {
    if (qty === 1) return finalPrice;
    if (qty === 2) return finalPrice * 2 * 0.95;
    if (qty === 3) return finalPrice * 3 * 0.90;
    return finalPrice;
  };
  const savings = originalPrice - finalPrice;

  const handleBuyNow = async () => {
    if (!requireAuth('checkout')) {
      toast.warning("Please login to continue");
      setShowLoginPrompt(true);
      return;
    }
    const finalQty = selectedBundle === 3 ? 3 : selectedBundle;
    const productData = {
      id: product.id,
      plantName: product.plantName || product.product_name,
      name: product.plantName || product.product_name,
      price: originalPrice,
      discountPrice: finalPrice < originalPrice ? finalPrice : undefined,
      discount: discountPercent,
      image: product.imageUrls?.[0] || product.image?.split(',')[0],
      imageUrls: product.imageUrls,
      category: product.category,
    };
    try {
      await addToCart(productData, undefined, finalQty);
      toast.success(`${product.plantName || product.product_name} added to cart!`);
      navigate('/checkout');
    } catch (e) {
      console.error('Buy Now error:', e);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleAddToCart = async () => {
    if (!requireAuth('add to cart')) {
      toast.warning("Please login to add items to cart");
      setShowLoginPrompt(true);
      return;
    }
    const finalQty = selectedBundle === 3 ? 3 : selectedBundle;
    const productData = {
      id: product.id,
      plantName: product.plantName || product.product_name,
      name: product.plantName || product.product_name,
      price: originalPrice,
      discountPrice: finalPrice < originalPrice ? finalPrice : undefined,
      discount: discountPercent,
      image: product.imageUrls?.[0] || product.image?.split(',')[0],
      imageUrls: product.imageUrls,
      category: product.category,
    };
    try {
      await addToCart(productData, undefined, finalQty);
      toast.success(`${product.plantName || product.product_name} added to cart!`);
    } catch (e) {
      console.error('Add to Cart error:', e);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleWishlistToggle = () => {
    if (!requireAuth('manage wishlist')) {
      toast.warning("Please login to manage your wishlist");
      setShowLoginPrompt(true);
      return;
    }
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`${product.plantName || product.product_name} added to wishlist!`);
    } else {
      toast.info(`${product.plantName || product.product_name} removed from wishlist`);
    }
  };

  const handleAddBoth = async () => {
    if (!requireAuth('add to cart')) {
      toast.warning("Please login to continue");
      setShowLoginPrompt(true);
      return;
    }
    try {
      // Add current product
      const productData = {
        id: product.id,
        plantName: product.plantName || product.product_name,
        name: product.plantName || product.product_name,
        price: originalPrice,
        discountPrice: finalPrice < originalPrice ? finalPrice : undefined,
        discount: discountPercent,
        image: product.imageUrls?.[0] || product.image?.split(',')[0],
        imageUrls: product.imageUrls,
        category: product.category,
      };
      await addToCart(productData, undefined, 1);

      // Add Premium Soil Mix as a separate cart item
      const soilMix = {
        id: 'premium-soil-mix',
        plantName: 'Premium Soil Mix',
        name: 'Premium Soil Mix',
        price: 99,
        discount: 0,
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
        category: 'Accessories',
      };
      await addToCart(soilMix, undefined, 1);

      toast.success('Both items added to cart! 🌱');
    } catch (e) {
      console.error('Add Both error:', e);
      toast.error('Could not add items. Please try again.');
    }
  };

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-4 md:px-12">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-10 uppercase tracking-widest">
          <button onClick={() => navigate(-1)} className="hover:text-primary transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <FaChevronRight size={8} />
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <FaChevronRight size={8} />
          <Link to="/all-products" className="hover:text-primary transition-colors">Shop</Link>
          <FaChevronRight size={8} />
          <span className="text-primary">{product.plantName || product.product_name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">

          {/* Gallery Section */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white shadow-2xl border-8 border-white group relative">
              <img
                src={images[selectedImage]}
                alt={product.plantName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${selectedImage === idx ? "border-primary shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Product Description — below image */}
            {(product.description || product.details || product.about) && (
              <div className="mt-4 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-display font-black text-primary uppercase tracking-tighter mb-5 pb-4 border-b border-gray-100">
                  About This Plant
                </h2>
                <div className="space-y-3">
                  {(product.description || product.details || product.about).split('\n').map((para, i) =>
                    para.trim() ? <p key={i} className="text-gray-600 font-medium leading-7 text-sm">{para}</p> : null
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-yellow-400 bg-white px-3 py-1 rounded-full shadow-sm">
                  {[...Array(5)].map((_, i) => <FaStar key={i} size={12} />)}
                  <span className="text-[10px] font-black text-primary ml-2 uppercase tracking-widest">5.0 Rating</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest underline decoration-accent underline-offset-4">128 Reviews</span>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {Math.floor(Math.random() * 50) + 20} people viewed this today
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-black text-primary mb-4 tracking-tighter leading-none uppercase">
                {product.plantName || product.product_name}
              </h1>

              <div className="flex flex-col gap-2 mb-8">
                <div className="flex items-baseline gap-4 flex-wrap">
                  {discountPercent > 0 ? (
                    <>
                      <span className="text-4xl md:text-5xl font-display font-black text-primary">₹{finalPrice}</span>
                      <span className="text-xl text-gray-400 line-through font-semibold">₹{originalPrice}</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest">
                        {discountPercent}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl md:text-5xl font-display font-black text-primary">₹{originalPrice}</span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <p className="text-sm font-bold text-green-600 italic">
                    You save ₹{savings} on this purchase!
                  </p>
                )}
                <span className="text-[10px] font-black text-accent uppercase tracking-widest mt-2">Shipping calculated at checkout</span>
              </div>

              {/* Urgency Badge */}
              <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-10 flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                Hurry up! Only a few items left!
              </div>

              {/* Trust Points */}
              <div className="space-y-4 mb-10">
                {[
                  { icon: <FaTruck />, text: "Free Shipping on all orders over ₹549" },
                  { icon: <FaGift />, text: "Exclusive Bonus Offer just for you!" },
                  { icon: <FaLeaf />, text: "Get 5% OFF automatically on orders above ₹1599" },
                  { icon: <FaUndo />, text: "Easy Returns - Compulsory Unboxing Video" }
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="text-accent">{point.icon}</span>
                    {point.text}
                  </div>
                ))}
              </div>

              {/* Security Badge */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-12 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-2 italic">Trusted Partner</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png" className="h-6 w-auto grayscale opacity-50" alt="Razorpay" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-[9px] font-black text-primary/60 uppercase">
                    <FaShieldAlt className="text-primary" /> Verified Business
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-black text-primary/60 uppercase">
                    <FaShieldAlt className="text-primary" /> Secured Payments
                  </div>
                </div>
              </div>

              {/* Bundle Selection */}
              <div className="mb-12">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Buy more, Save more</h4>
                <div className="space-y-3">
                  {[
                    { id: 1, label: "Buy 1", badge: "Standard", price: finalPrice },
                    { id: 2, label: "Buy 2", badge: "Save 5%", price: finalPrice * 2 * 0.95, popular: true },
                    { id: 3, label: "Buy 3+", badge: "Save 10%", price: finalPrice * 3 * 0.90 }
                  ].map(bundle => (
                    <button
                      key={bundle.id}
                      onClick={() => setSelectedBundle(bundle.id)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between group relative ${selectedBundle === bundle.id ? "bg-white border-primary shadow-xl" : "bg-transparent border-gray-100 hover:border-primary/30"
                        }`}
                    >
                      {bundle.popular && (
                        <span className="absolute -top-3 right-6 bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>
                      )}
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBundle === bundle.id ? "border-primary" : "border-gray-200"}`}>
                          {selectedBundle === bundle.id && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-black text-primary uppercase">{bundle.label}</span>
                          <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded uppercase tracking-widest mt-1">{bundle.badge}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-display font-black text-primary">₹{bundle.price.toFixed(2)}</span>
                        {bundle.id > 1 && <span className="text-[10px] text-gray-300 line-through font-bold">₹{(finalPrice * (bundle.id === 3 ? 3 : 2)).toFixed(2)}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Action */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full bg-primary hover:bg-accent text-white h-20 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart /> {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                </button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-grow h-16 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold transition-all ${isWishlisted ? 'bg-accent border-accent text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-accent hover:text-accent'}`}
                  >
                    <FaHeart /> {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button className="w-16 h-16 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-primary hover:border-primary transition-all">
                    <FaGift size={20} />
                  </button>
                </div>
              </div>

              {/* Frequently Bought Together Mockup */}
              <div className="mt-16 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Frequently Bought Together</h4>
                <div className="flex items-center gap-6">
                  <img src={images[0]} className="w-20 h-20 rounded-2xl object-cover border border-gray-100" alt="" />
                  <FaPlus className="text-gray-200" />
                  <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center border border-gray-100">
                    <FaLeaf className="text-primary/20" size={30} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Add Premium Soil Mix</p>
                    <p className="text-lg font-display font-black text-accent">+ ₹99</p>
                  </div>
                  <button
                    onClick={handleAddBoth}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest border border-primary hover:bg-accent hover:border-accent transition-all shadow-lg"
                  >
                    Add Both
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product Specs / Additional Details */}
        {(product.careInstructions || product.sunlight || product.watering || product.size) && (
          <div className="mt-8 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-display font-black text-primary uppercase tracking-tighter mb-6 pb-4 border-b border-gray-100">
              Care & Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.sunlight && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">☀ Sunlight</span>
                  <span className="text-sm font-bold text-primary">{product.sunlight}</span>
                </div>
              )}
              {product.watering && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">💧 Watering</span>
                  <span className="text-sm font-bold text-primary">{product.watering}</span>
                </div>
              )}
              {product.size && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">📏 Size</span>
                  <span className="text-sm font-bold text-primary">{product.size}</span>
                </div>
              )}
              {product.careInstructions && (
                <div className="col-span-full flex flex-col gap-1">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">🌿 Care Instructions</span>
                  <span className="text-sm font-medium text-gray-600 leading-6">{product.careInstructions}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="text-accent font-bold text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-accent underline-offset-8">Curated For You</span>
                <h2 className="text-4xl md:text-5xl font-display font-black text-primary leading-none tracking-tighter uppercase">
                  You May Also <br /> <span className="text-accent">Love These</span>
                </h2>
              </div>
              <Link to="/all-products" className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all">View Entire Shop</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

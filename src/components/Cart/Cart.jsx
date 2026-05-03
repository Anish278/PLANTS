import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowRight, FaShieldAlt, FaTruck, FaUndo, FaTag, FaChevronLeft } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal(); // discounted total
  // Calculate original MRP total (before product discounts)
  const originalTotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const itemDiscount = originalTotal - subtotal; // savings from product discounts
  const shipping = subtotal > 549 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      const d = subtotal * 0.1;
      setDiscount(d);
      toast.success('Promo code applied! 10% discount added.');
    } else {
      toast.error('Invalid promo code');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-primary shadow-2xl shadow-primary/10">
            <FaShoppingCart size={44} />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-primary mb-6 tracking-tighter uppercase leading-none">
             Your Garden <br/> <span className="text-accent">is Empty</span>
          </h2>
          <p className="text-gray-400 mb-12 max-w-md mx-auto font-medium italic">Looks like you haven't added any green friends to your collection yet. Let's find some!</p>
          <Link to="/all-products" className="bg-primary text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-accent transition-all shadow-2xl shadow-primary/30 inline-flex items-center gap-4 group">
            Go To Shop <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Cart Items */}
          <div className="flex-1 min-w-0">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-gray-100 pb-8">
                <div>
                   <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-2 block underline decoration-accent underline-offset-8">Review Order</span>
                   <h1 className="text-3xl md:text-5xl font-display font-black text-primary leading-none tracking-tighter uppercase">
                      My Shopping <br/> <span className="text-accent">Cart ({cart.length})</span>
                   </h1>
                </div>
                <Link to="/all-products" className="text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:text-accent transition-all whitespace-nowrap">
                   <FaChevronLeft size={10} /> Continue Shopping
                </Link>
             </div>

             <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all duration-300">
                    
                    {/* Image — click to go to product detail */}
                    <div
                      className="w-16 h-16 rounded-xl overflow-hidden bg-cream shrink-0 border-2 border-gray-50 shadow-sm cursor-pointer hover:border-primary transition-all"
                      onClick={() => item.id !== 'premium-soil-mix' && navigate(`/product/${item.id}`)}
                    >
                      <img src={item.imageUrls?.[0] || item.image?.split(',')[0]} alt={item.plantName} className="w-full h-full object-cover" />
                    </div>

                    {/* Name + Category — click to go to product detail */}
                    <div
                      className={'flex-1 min-w-0 ' + (item.id !== 'premium-soil-mix' ? 'cursor-pointer' : '')}
                      onClick={() => item.id !== 'premium-soil-mix' && navigate(`/product/${item.id}`)}
                    >
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">{item.category}</span>
                      <h3 className="text-sm font-black text-primary leading-tight tracking-tight uppercase truncate mt-1 hover:text-accent transition-colors">
                        {item.plantName || item.name || item.product_name}
                      </h3>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-cream rounded-xl p-1 shadow-inner shrink-0">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all text-primary">
                        <FaMinus size={9} />
                      </button>
                      <span className="w-8 text-center font-black text-primary text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg transition-all text-primary">
                        <FaPlus size={9} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end shrink-0">
                      {(() => {
                        const origP = Number(item.price || 0);
                        let saleP = origP;
                        let pct = 0;
                        if (item.discountPrice && Number(item.discountPrice) < origP) {
                          saleP = Number(item.discountPrice);
                          pct = Math.round(((origP - saleP) / origP) * 100);
                        } else if (Number(item.discount) > 0) {
                          pct = Number(item.discount);
                          saleP = Math.round(origP * (1 - pct / 100));
                        }
                        const hasDsc = pct > 0 && saleP < origP;
                        return (
                          <>
                            <span className="text-base font-black text-primary font-display">
                              ₹{(saleP * item.quantity).toFixed(0)}
                            </span>
                            {hasDsc && (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-gray-400 line-through">₹{(origP * item.quantity).toFixed(0)}</span>
                                <span className="text-[8px] font-black text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">{pct}% OFF</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Delete */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shrink-0"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                ))}
             </div>

             {/* Bottom Info Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: <FaTruck />, title: "Express Delivery", desc: "India wide safe shipping" },
                  { icon: <FaUndo />, title: "Quality Check", desc: "Pre-dispatch unboxing" },
                  { icon: <FaShieldAlt />, title: "Safe Checkout", desc: "100% encrypted payment" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border border-gray-50 shadow-sm group hover:border-primary transition-all">
                     <div className="w-10 h-10 shrink-0 bg-cream text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        {badge.icon}
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">{badge.title}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{badge.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-80 xl:w-96 shrink-0">
             <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-gray-50 sticky top-28">
                <h2 className="text-2xl font-display font-black text-primary uppercase tracking-tighter mb-10 border-b border-gray-100 pb-6">Summary</h2>
                
                <div className="space-y-5 mb-10">
                    {/* 1. Total MRP */}
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       <span>Total Price (MRP)</span>
                       <span className="text-primary font-display text-base">₹{originalTotal.toFixed(2)}</span>
                    </div>

                    {/* 2. Product Discount */}
                    {itemDiscount > 0 && (
                       <div className="flex justify-between text-[10px] font-black text-green-600 uppercase tracking-widest">
                          <span>Product Discount</span>
                          <span>- ₹{itemDiscount.toFixed(2)}</span>
                       </div>
                    )}

                    {/* 3. Promo Savings */}
                    {discount > 0 && (
                       <div className="flex justify-between text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-50 p-4 rounded-2xl">
                          <span>Promo Savings</span>
                          <span>- ₹{discount.toFixed(2)}</span>
                       </div>
                    )}

                    {/* 4. Shipping */}
                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                       <span>Shipping Fee</span>
                       <span className={shipping === 0 ? "text-green-500 font-black" : "text-primary font-display text-base"}>
                          {shipping === 0 ? "COMPLIMENTARY" : `₹${shipping.toFixed(2)}`}
                       </span>
                    </div>

                    {/* Total savings badge */}
                    {(itemDiscount + discount) > 0 && (
                       <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex justify-between items-center">
                          <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">You Save</span>
                          <span className="text-sm font-black text-green-600">₹{(itemDiscount + discount).toFixed(2)}</span>
                       </div>
                    )}

                    {/* 5. Grand Total */}
                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Grand Total</span>
                          <span className="text-4xl font-display font-black text-primary tracking-tighter">₹{total.toFixed(2)}</span>
                       </div>
                    </div>
                </div>

                {/* Promo Input */}
                <div className="mb-10 group">
                   <div className="flex gap-2">
                      <div className="relative flex-grow">
                         <input 
                           type="text" 
                           placeholder="Apply Coupon" 
                           className="w-full bg-cream border-2 border-transparent focus:border-primary/20 px-6 py-4 rounded-[1.5rem] text-xs font-black focus:outline-none uppercase tracking-widest transition-all"
                           value={promoCode}
                           onChange={(e) => setPromoCode(e.target.value)}
                         />
                         <FaTag className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                      </div>
                      <button 
                        onClick={handleApplyPromo}
                        className="bg-primary text-white px-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all shadow-xl shadow-primary/20"
                      >
                        Apply
                      </button>
                   </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-accent hover:bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-accent/40 transition-all flex items-center justify-center gap-4 group uppercase tracking-widest"
                >
                  Checkout <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>

                <div className="mt-10 flex items-center justify-center gap-4 grayscale opacity-30">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png" className="h-4 w-auto" alt="" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 w-auto" alt="" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 w-auto" alt="" />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;

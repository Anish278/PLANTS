import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { createRazorpayOrder, verifyPayment } from "../../firebase/functions";
import { saveSuccessfulPayment } from "../../firebase/firestore";
import AddressForm from "../../Component/AddressManagement/AddressForm";
import { 
  FaMapMarkerAlt, FaCheckCircle, FaChevronRight, FaPlus, 
  FaTrash, FaTruck, FaShieldAlt, FaLeaf, FaShoppingBag 
} from "react-icons/fa";
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { selectedItems, getSelectedItemsTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Review & Pay
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(true);

  const subtotal = getSelectedItemsTotal();
  const shipping = subtotal > 2999 ? 0 : 200;
  const total = subtotal + shipping;

  useEffect(() => {
    if (user?.uid) {
      fetchAddresses();
    }
    if (selectedItems.length === 0) {
      navigate('/cart');
    }
  }, [user, selectedItems]);

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(list);
      const def = list.find(a => a.isDefault) || list[0];
      if (def) setSelectedAddress(def);
    } catch (err) {
      console.error(err);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSaveAddress = async (formData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "addresses"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date()
      });
      const newAddr = { id: docRef.id, ...formData };
      setAddresses([...addresses, newAddr]);
      setSelectedAddress(newAddr);
      setShowAddressForm(false);
      toast.success("Address saved!");
    } catch (err) {
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderResponse = await createRazorpayOrder(total);
      
      const options = {
        key: "rzp_live_oR04gue1fn6wcY",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "PLANTVIGOR",
        description: "Order Payment",
        order_id: orderResponse.id,
        prefill: {
          name: selectedAddress.fullName,
          email: user.email,
          contact: selectedAddress.mobile
        },
        handler: async (res) => {
          try {
            await saveSuccessfulPayment({
              orderId: res.razorpay_order_id,
              paymentId: res.razorpay_payment_id,
              signature: res.razorpay_signature,
              amount: total,
              items: selectedItems,
              userId: user.uid,
              shippingAddress: selectedAddress,
              orderDate: new Date().toISOString()
            });
            clearCart();
            navigate(`/payment-success?order_id=${res.razorpay_order_id}`);
          } catch (err) {
            console.error(err);
            toast.error("Payment saved with errors, contact support.");
          }
        },
        theme: { color: "#2E7D32" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment failed to initialize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Checkout Steps Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? "bg-primary text-white" : "bg-white text-gray-400"}`}>1</div>
            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step >= 2 ? "bg-primary text-white" : "bg-white text-gray-400"}`}>2</div>
            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step >= 3 ? "bg-primary text-white" : "bg-white text-gray-400"}`}>3</div>
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
            <span>Shipping</span>
            <span>Review & Pay</span>
            <span>Confirm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-display font-extrabold text-forest">Shipping Address</h2>
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-primary font-bold hover:underline"
                  >
                    <FaPlus size={12} /> Add New
                  </button>
                </div>

                {showAddressForm ? (
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <AddressForm onSave={handleSaveAddress} onCancel={() => setShowAddressForm(false)} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all relative ${
                          selectedAddress?.id === addr.id ? "border-primary bg-primary/5 shadow-lg" : "border-gray-100 bg-white hover:border-primary/50"
                        }`}
                      >
                        {selectedAddress?.id === addr.id && (
                          <FaCheckCircle className="absolute top-6 right-6 text-primary" size={24} />
                        )}
                        <h3 className="font-bold text-forest mb-2">{addr.fullName}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ","} <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="mt-4 text-sm font-bold text-forest">{addr.mobile}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  disabled={!selectedAddress || showAddressForm}
                  onClick={() => setStep(2)}
                  className="mt-12 w-full bg-forest text-white py-5 rounded-2xl font-bold text-lg shadow-xl disabled:bg-gray-200 transition-all flex items-center justify-center gap-3"
                >
                  Continue to Review <FaChevronRight />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-display font-extrabold text-forest mb-8">Review Your Order</h2>
                
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-8">
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h4 className="font-bold text-forest">Deliver to {selectedAddress.fullName}</h4>
                        <p className="text-xs text-gray-400">{selectedAddress.addressLine1}, {selectedAddress.city}</p>
                      </div>
                    </div>
                    <button onClick={() => setStep(1)} className="text-primary font-bold text-sm hover:underline">Change</button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                          <img src={item.imageUrls?.[0] || item.image?.split(',')[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-forest">{item.plantName || item.product_name}</h4>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-forest">₹{(item.discountPrice || item.price) * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h4 className="font-bold text-forest">Secure Payment</h4>
                      <p className="text-xs text-gray-500">Your transaction is encrypted and safe.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center gap-3"
                  >
                    {loading ? "Processing..." : `Pay ₹${total} Now`}
                  </button>
                </div>
                
                <button onClick={() => setStep(1)} className="mt-8 text-gray-400 font-bold hover:text-forest transition-colors flex items-center gap-2 mx-auto">
                   Go Back
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-display font-bold text-forest mb-8">Summary</h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center text-gray-500 font-medium text-sm">
                  <span>Subtotal</span>
                  <span className="text-forest font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-primary font-bold" : "text-forest font-bold"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between items-center text-2xl font-display font-extrabold text-forest">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <FaTruck className="text-primary" />
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expected by: 3-5 Business Days</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <FaLeaf className="text-primary" />
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nursery Fresh & Healthy Guarantee</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

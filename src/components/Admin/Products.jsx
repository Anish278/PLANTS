import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaCloudUploadAlt, FaSave, FaChevronDown, FaLeaf, FaStar } from 'react-icons/fa';
import './Products.css';
import { db } from '../../firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where
} from 'firebase/firestore';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    plantName: '',
    subtitle: '',
    category: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    productCode: '',
    imageUrls: [],
    plantType: '',
    size: '',
    potIncluded: false,
    potType: '',
    wateringFrequency: '',
    sunlightRequirement: '',
    maintenanceLevel: '',
    fertilizerNeed: '',
    description: '',
    benefits: '',
    isAirPurifying: false,
    isPetFriendly: false,
    featured: false,
    rating: 5,
    reviews: 100,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'products'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploadingImage(true);
    try {
      const uploadPromises = files.map(file => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ml_default');
        return axios.post('https://api.cloudinary.com/v1_1/drzgk4yba/image/upload', data);
      });
      const responses = await Promise.all(uploadPromises);
      const newUrls = responses.map(res => res.data.secure_url);
      setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...newUrls] }));
      toast.success("Images uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, updatedAt: serverTimestamp() };
      if (selectedProduct) {
        await updateDoc(doc(db, 'products', selectedProduct.id), data);
        toast.success("Product updated!");
      } else {
        const newDocRef = doc(collection(db, 'products'));
        await setDoc(newDocRef, { ...data, createdAt: serverTimestamp() });
        toast.success("Product added!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success("Product deleted");
        fetchProducts();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      plantName: '', subtitle: '', category: '', price: '', discountPrice: '', stockQuantity: '',
      productCode: '', imageUrls: [], plantType: '', size: '', potIncluded: false, potType: '',
      wateringFrequency: '', sunlightRequirement: '', maintenanceLevel: '', fertilizerNeed: '',
      description: '', benefits: '', isAirPurifying: false, isPetFriendly: false, featured: false,
      rating: 5, reviews: 100
    });
    setSelectedProduct(null);
    setActiveTab('basic');
  };

  const filteredProducts = products.filter(p =>
    p.plantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container bg-gray-50 min-h-screen p-8">
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-display font-black text-forest uppercase tracking-tight">Product Management</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Manage your botanical inventory</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-accent text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-accent/20 hover:scale-105 transition-transform"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <div className="relative mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search by name or code..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-primary focus:outline-none font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-6 px-4">Product</th>
                <th className="pb-6 px-4">Category</th>
                <th className="pb-6 px-4">Price</th>
                <th className="pb-6 px-4">Stock</th>
                <th className="pb-6 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map(p => (
                <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={p.imageUrls?.[0] || p.image?.split(',')[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-forest">{p.plantName}</p>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{p.productCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase">{p.category}</span>
                  </td>
                  <td className="py-6 px-4 font-bold text-forest">₹{p.discountPrice || p.price}</td>
                  <td className="py-6 px-4">
                    <span className={`font-bold text-sm ${p.stockQuantity > 5 ? 'text-green-500' : 'text-red-500'}`}>{p.stockQuantity} Left</span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setSelectedProduct(p); setFormData(p); setShowModal(true); }}
                        className="p-3 bg-white text-primary rounded-xl shadow-sm border border-gray-100 hover:bg-primary hover:text-white transition-all"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-3 bg-white text-red-500 rounded-xl shadow-sm border border-gray-100 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-black text-forest uppercase tracking-tight">
                  {selectedProduct ? 'Edit Product' : 'Add New Plant'}
                </h2>
                <div className="flex gap-4 mt-4">
                  {['basic', 'pricing', 'details', 'images'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-10">
              {activeTab === 'basic' && (
                <div className="grid grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Plant Name</label>
                    <input type="text" value={formData.plantName} onChange={(e) => setFormData({ ...formData, plantName: e.target.value })} className="admin-input" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Subtitle / Tagline</label>
                    <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="admin-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="admin-input">
                      <option value="">Select Category</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Succulents">Succulents</option>
                      <option value="Pots">Pots & Planters</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Product Code</label>
                    <input type="text" value={formData.productCode} onChange={(e) => setFormData({ ...formData, productCode: e.target.value })} className="admin-input" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="admin-input h-32" />
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="grid grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Original Price (₹)</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="admin-input" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Discount Price (₹)</label>
                    <input type="number" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} className="admin-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Stock Quantity</label>
                    <input type="number" value={formData.stockQuantity} onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} className="admin-input" required />
                  </div>
                  <div className="space-y-4 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary" />
                      <span className="text-sm font-bold text-forest group-hover:text-primary transition-colors uppercase tracking-widest">Mark as Best Seller</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-2 gap-8 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Watering Frequency</label>
                    <input type="text" value={formData.wateringFrequency} onChange={(e) => setFormData({ ...formData, wateringFrequency: e.target.value })} className="admin-input" placeholder="e.g. Weekly" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Sunlight Requirement</label>
                    <input type="text" value={formData.sunlightRequirement} onChange={(e) => setFormData({ ...formData, sunlightRequirement: e.target.value })} className="admin-input" placeholder="e.g. Bright Indirect" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Maintenance Level</label>
                    <select value={formData.maintenanceLevel} onChange={(e) => setFormData({ ...formData, maintenanceLevel: e.target.value })} className="admin-input">
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-6 pt-6 grid grid-cols-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.isAirPurifying} onChange={(e) => setFormData({ ...formData, isAirPurifying: e.target.checked })} className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary" />
                      <span className="text-[10px] font-bold text-forest uppercase tracking-widest">Air Purifying</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.isPetFriendly} onChange={(e) => setFormData({ ...formData, isPetFriendly: e.target.checked })} className="w-5 h-5 rounded border-gray-200 text-primary focus:ring-primary" />
                      <span className="text-[10px] font-bold text-forest uppercase tracking-widest">Pet Friendly</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Star Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="admin-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Initial Review Count</label>
                    <input type="number" value={formData.reviews} onChange={(e) => setFormData({ ...formData, reviews: e.target.value })} className="admin-input" />
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center hover:border-primary transition-all group">
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" id="imageUpload" />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <FaCloudUploadAlt className="text-6xl text-gray-200 mx-auto mb-4 group-hover:text-primary transition-colors" />
                      <p className="text-lg font-display font-bold text-forest">Drag and drop or click to upload</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Support JPG, PNG up to 5MB</p>
                    </label>
                  </div>

                  {isUploadingImage && (
                    <div className="text-center text-primary font-bold animate-pulse">Uploading...</div>
                  )}

                  <div className="grid grid-cols-4 gap-6">
                    {formData.imageUrls.map((url, i) => (
                      <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                        <img src={url} className="w-full h-full object-cover" alt="" />
                        <button
                          onClick={() => setFormData({ ...formData, imageUrls: formData.imageUrls.filter((_, idx) => idx !== i) })}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <FaLeaf className="text-primary" /> Nature Care Admin Panel
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowModal(false)} className="px-8 py-4 rounded-xl font-bold text-gray-400 hover:text-primary transition-all">Discard Changes</button>
                <button onClick={handleSubmit} className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  <FaSave /> {selectedProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

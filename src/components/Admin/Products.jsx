import React, { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import './Products.css';
import { db } from '../../firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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
    growthRate: '',
    lifespan: '',
    deliveryTime: '',
    returnPolicy: '',
    featured: false,
    views: 0,
    bought: 0
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Helper function to get first image from array
  const getFirstImage = (imageUrls) => {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) return null;
    return imageUrls[0];
  };

  // Helper function to get all media items with types
  const getMediaItems = (imageField) => {
    if (!imageField) return [];
    return imageField.split(',').map(img => {
      const trimmed = img.trim();
      if (!trimmed) return null;
      const src = trimmed.startsWith('/') || trimmed.startsWith('http') ? trimmed : `/${trimmed}`;
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
      return { src, isVideo };
    }).filter(Boolean);
  };

  // Process products once with useMemo to avoid reprocessing on every render
  const processedProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      firstImage: getFirstImage(product.imageUrls),
      plantName: product.plantName || 'Unnamed Plant',
      category: product.category || 'Uncategorized',
      price: product.price || 0,
      stockQuantity: product.stockQuantity || 0,
      views: product.views || 0
    }));
  }, [products]);

  // Filter products based on search term and price range
  const filteredProducts = useMemo(() => {
    return processedProducts.filter(product => {
      // Search filter - check product code and name
      const searchMatch = !searchTerm ||
        (product.productCode && product.productCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.plantName && product.plantName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Price filter
      const price = Number(product.price) || 0;
      const minPriceFilter = !minPrice || price >= Number(minPrice);
      const maxPriceFilter = !maxPrice || price <= Number(maxPrice);

      return searchMatch && minPriceFilter && maxPriceFilter;
    });
  }, [processedProducts, searchTerm, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);

      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(productsData);
      setError(null);
      console.log('Fetched products from Firebase:', productsData);
    } catch (err) {
      console.error('Error fetching products from Firebase:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingImage(true);
    setUploadProgress(0);

    // Get Cloudinary config from environment variables with fallbacks
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drzgk4yba';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'plant_upload';

    console.log('Starting upload to Cloudinary...', { cloudName, uploadPreset, filesCount: files.length });

    try {
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);

        const formDataCloudinary = new FormData();
        formDataCloudinary.append('file', file);
        formDataCloudinary.append('upload_preset', uploadPreset);

        try {
          // Using 'auto' resource type to support both images and videos automatically
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            formDataCloudinary,
            {
              onUploadProgress: (progressEvent) => {
                const fileProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // Calculate overall progress across all files
                const totalProgress = Math.round(((i * 100) + fileProgress) / files.length);
                setUploadProgress(totalProgress);
              }
            }
          );

          if (response.data.secure_url) {
            uploadedUrls.push(response.data.secure_url);
            console.log(`Successfully uploaded: ${file.name} -> ${response.data.secure_url}`);
          }
        } catch (fileErr) {
          console.error(`Error uploading file ${file.name}:`, fileErr);
          const errorDetail = fileErr.response?.data?.error?.message || fileErr.message;
          toast.error(`Failed to upload ${file.name}: ${errorDetail}`);
          // Continue with other files if one fails
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...uploadedUrls]
        }));
        toast.success(`Successfully uploaded ${uploadedUrls.length} file(s)`);
      }

    } catch (err) {
      console.error('General error in handleImageUpload:', err);
      const errorMsg = 'An unexpected error occurred during upload. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploadingImage) return;

    try {
      // Convert numeric fields
      const processedData = {
        ...formData,
        price: Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        stockQuantity: Number(formData.stockQuantity) || 0,
        views: Number(formData.views) || 0,
        bought: Number(formData.bought) || 0,
        updatedAt: serverTimestamp()
      };

      if (selectedProduct) {
        // Update existing product
        const productRef = doc(db, 'products', selectedProduct.id);
        await updateDoc(productRef, processedData);
        console.log('Product updated in Firebase:', selectedProduct.id);
      } else {
        // Create new product
        const newProductRef = doc(collection(db, 'products'));
        await setDoc(newProductRef, {
          ...processedData,
          createdAt: serverTimestamp()
        });
        console.log('New product added to Firebase:', newProductRef.id);
      }

      setShowModal(false);
      setSelectedProduct(null);
      resetFormData();
      fetchProducts();
      toast.success(selectedProduct ? 'Product updated successfully!' : 'Product saved successfully!');
    } catch (err) {
      console.error('Error saving product to Firebase:', err);
      const errorMsg = 'Failed to save product: ' + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const resetFormData = () => {
    setFormData({
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
      growthRate: '',
      lifespan: '',
      deliveryTime: '',
      returnPolicy: '',
      featured: false,
      views: 0,
      bought: 0
    });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      plantName: product.plantName || '',
      subtitle: product.subtitle || '',
      category: product.category || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      stockQuantity: product.stockQuantity || '',
      productCode: product.productCode || '',
      imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : [],
      plantType: product.plantType || '',
      size: product.size || '',
      potIncluded: product.potIncluded || false,
      potType: product.potType || '',
      wateringFrequency: product.wateringFrequency || '',
      sunlightRequirement: product.sunlightRequirement || '',
      maintenanceLevel: product.maintenanceLevel || '',
      fertilizerNeed: product.fertilizerNeed || '',
      description: product.description || '',
      benefits: product.benefits || '',
      isAirPurifying: product.isAirPurifying || false,
      isPetFriendly: product.isPetFriendly || false,
      growthRate: product.growthRate || '',
      lifespan: product.lifespan || '',
      deliveryTime: product.deliveryTime || '',
      returnPolicy: product.returnPolicy || '',
      featured: product.featured || false,
      views: product.views || 0,
      bought: product.bought || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        if (typeof id === 'number') {
          // If ID is a number, find the document by query
          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('id', '==', id));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            console.log('Product deleted from Firebase by numeric ID:', id);
          } else {
            throw new Error(`Product with numeric ID ${id} not found`);
          }
        } else {
          // If ID is a string (document ID), delete directly
          const productRef = doc(db, 'products', id);
          await deleteDoc(productRef);
          console.log('Product deleted from Firebase by document ID:', id);
        }
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product from Firebase:', err);
        setError('Failed to delete product: ' + err.message);
      }
    }
  };

  const handleBulkAdd = async () => {
    try {
      setLoading(true);
      let productsToAdd;
      try {
        productsToAdd = JSON.parse(bulkJson);
        if (!Array.isArray(productsToAdd)) {
          throw new Error('Input must be an array of products');
        }
      } catch (err) {
        setError('Invalid JSON format. Please check your input.');
        return;
      }

      // Check for duplicate product codes in the input array
      const productCodes = new Set();
      const duplicateCodes = new Set();
      const uniqueProducts = [];

      // Filter out duplicates from input array
      productsToAdd.forEach(product => {
        if (product.product_code) {
          if (productCodes.has(product.product_code)) {
            duplicateCodes.add(product.product_code);
          } else {
            productCodes.add(product.product_code);
            uniqueProducts.push(product);
          }
        }
      });

      // Check for duplicates in Firebase database
      const productsRef = collection(db, 'products');
      const productCodesToCheck = Array.from(productCodes);
      const duplicateCodesInDB = new Set();
      const validProducts = [];

      // Check each product code against the database
      for (const product of uniqueProducts) {
        const q = query(productsRef, where('product_code', '==', product.product_code));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          validProducts.push(product);
        } else {
          duplicateCodesInDB.add(product.product_code);
        }
      }

      // If no valid products to add, show error and return
      if (validProducts.length === 0) {
        setError('No valid products to add. All product codes either duplicate in input or already exist in database.');
        return;
      }

      // Show warning if some products were skipped
      if (duplicateCodes.size > 0 || duplicateCodesInDB.size > 0) {
        let warningMessage = 'Some products were skipped:';
        if (duplicateCodes.size > 0) {
          warningMessage += `\n- Duplicate in input: ${Array.from(duplicateCodes).join(', ')}`;
        }
        if (duplicateCodesInDB.size > 0) {
          warningMessage += `\n- Already exist in database: ${Array.from(duplicateCodesInDB).join(', ')}`;
        }
        setError(warningMessage);
      }

      // Get the highest existing ID
      const highestId = products.reduce((max, product) =>
        (product.id && typeof product.id === 'number' && product.id > max) ? product.id : max, 0);

      // Add valid products to the database
      for (let i = 0; i < validProducts.length; i++) {
        const product = validProducts[i];
        const newProductRef = doc(collection(db, 'products'));

        // Convert numeric fields
        const numericProduct = {
          ...product,
          inventory: Number(product.inventory) || 0,
          mrp: Number(product.mrp) || 0,
          discount: product.discount ? Number(product.discount) : 0,
          id: highestId + i + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await setDoc(newProductRef, numericProduct);
      }

      setShowBulkForm(false);
      setBulkJson('');
      fetchProducts();
    } catch (err) {
      setError('Failed to add products: ' + err.message);
      console.error('Error adding products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="products-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {error && (
        <div className="error-banner">
          {error}
          <button className="close-error" onClick={() => setError(null)}>×</button>
        </div>
      )}
      <div className="products-header">
        <h2>Products Management</h2>
        <div className="header-buttons">
          <button className="add-product-btn" onClick={() => setShowModal(true)}>
            <FaPlus /> Add New Product
          </button>
          <button
            className="bulk-add-btn"
            onClick={() => setShowBulkForm(!showBulkForm)}
          >
            Bulk Add Products
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by product code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{
                color: 'black',
              }}
            />
          </div>
        </div>
        <div className="price-filter-container">
          <div className="price-filter-group">
            <label>Min Price (₹)</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
              min="0"
            />
          </div>
          <div className="price-filter-group">
            <label>Max Price (₹)</label>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
              min="0"
            />
          </div>
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setMinPrice('');
              setMaxPrice('');
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {showBulkForm && (
        <div className="bulk-form">
          <h3>Bulk Add Products</h3>
          <div className="form-group">
            <label>Enter Products JSON:</label>
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder={`Enter products in JSON format. Example:
[
  {
    "product_name": "Product 1",
    "category": "Category 1",
    "sub_category": "Sub Category 1",
    "product_code": "P001",
    "color": "Red",
    "product_description": "Description 1",
    "material": "Material 1",
    "product_details": "Details 1",
    "dimension": "10x10x10",
    "care_instructions": "Care 1",
    "inventory": 100,
    "mrp": 999,
    "discount": 10,
            "image": "image1.webp",
    "featured": false
  }
]`}
              rows="10"
            />
          </div>
          <div className="form-actions">
            <button
              className="save-btn"
              onClick={handleBulkAdd}
            >
              Add Products
            </button>
            <button
              className="cancel-btn"
              onClick={() => {
                setShowBulkForm(false);
                setBulkJson('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="products-table-container">
        <div className="results-info">
          <span>Showing {filteredProducts.length} of {processedProducts.length} products</span>
          {(searchTerm || minPrice || maxPrice) && (
            <span className="filter-active">(Filtered)</span>
          )}
        </div>
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Product Code</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Views</th>
              <th>Bought</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={`product-${product.id}`}>
                <td>
                  {product.firstImage ? (
                    /\.(mp4|webm|ogg|mov)$/i.test(product.firstImage) ? (
                      <video
                        src={product.firstImage}
                        className="product-thumbnail"
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={product.firstImage}
                        alt="Product Image"
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = 'No Image Available';
                        }}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                </td>

                <td>{product.plantName}</td>
                <td>{product.productCode || 'N/A'}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.views || 0}</td>
                <td>{product.bought || 0}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {
        showModal && (
          <div className="modaloverlay">
            <div className="modal-content">
              <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <form onSubmit={handleSubmit} className="plant-product-form">
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Plant Name</label>
                      <input type="text" name="plantName" value={formData.plantName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Subtitle / Small Description</label>
                      <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} required>
                        <option value="">Select Category</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Succulent">Succulent</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Bonsai">Bonsai</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Product Code</label>
                      <input type="text" name="productCode" value={formData.productCode} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Discount Price (₹)</label>
                      <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Plant Details</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Plant Type</label>
                      <select name="plantType" value={formData.plantType} onChange={handleInputChange}>
                        <option value="">Select Type</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Semi-shade">Semi-shade</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Size (e.g., Small, Medium, Large)</label>
                      <input type="text" name="size" value={formData.size} onChange={handleInputChange} />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" name="potIncluded" checked={formData.potIncluded} onChange={handleInputChange} />
                        Pot Included
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Pot Type</label>
                      <select name="potType" value={formData.potType} onChange={handleInputChange}>
                        <option value="">Select Pot Type</option>
                        <option value="Plastic">Plastic</option>
                        <option value="Ceramic">Ceramic</option>
                        <option value="Grow Bag">Grow Bag</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Care & Info</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Watering Frequency</label>
                      <input type="text" name="wateringFrequency" value={formData.wateringFrequency} onChange={handleInputChange} placeholder="e.g. Twice a week" />
                    </div>
                    <div className="form-group">
                      <label>Sunlight Requirement</label>
                      <select name="sunlightRequirement" value={formData.sunlightRequirement} onChange={handleInputChange}>
                        <option value="">Select Requirement</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="Bright">Bright</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Maintenance Level</label>
                      <select name="maintenanceLevel" value={formData.maintenanceLevel} onChange={handleInputChange}>
                        <option value="">Select Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Fertilizer Need</label>
                      <input type="text" name="fertilizerNeed" value={formData.fertilizerNeed} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Description & Benefits</h4>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Benefits</label>
                    <textarea name="benefits" value={formData.benefits} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Extra Information</h4>
                  <div className="form-grid">
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" name="isAirPurifying" checked={formData.isAirPurifying} onChange={handleInputChange} />
                        Air Purifying
                      </label>
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" name="isPetFriendly" checked={formData.isPetFriendly} onChange={handleInputChange} />
                        Pet Friendly
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Growth Rate</label>
                      <select name="growthRate" value={formData.growthRate} onChange={handleInputChange}>
                        <option value="">Select Growth Rate</option>
                        <option value="Slow">Slow</option>
                        <option value="Medium">Medium</option>
                        <option value="Fast">Fast</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Lifespan</label>
                      <input type="text" name="lifespan" value={formData.lifespan} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Delivery Time</label>
                      <input type="text" name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Return Policy</label>
                      <input type="text" name="returnPolicy" value={formData.returnPolicy} onChange={handleInputChange} />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                        Featured Product
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Product Images</h4>
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      id="image-upload-input"
                    />
                    <label htmlFor="image-upload-input" className="upload-label">
                      {isUploadingImage ? `Uploading... ${uploadProgress}%` : 'Upload Images'}
                    </label>
                  </div>

                  <div className="image-previews">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="preview-item">
                        <img src={url} alt={`Preview ${index}`} />
                        <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="save-btn" disabled={isUploadingImage}>
                    {isUploadingImage ? 'Uploading images...' : (selectedProduct ? 'Update Product' : 'Save Product')}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => {
                    setShowModal(false);
                    setSelectedProduct(null);
                    resetFormData();
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Products; 

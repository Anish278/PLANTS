import React, { useState, useEffect } from 'react';
import { 
  getWishGenieProducts, 
  createWishGenieProduct, 
  updateWishGenieProduct, 
  deleteWishGenieProduct 
} from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import './WishGenieProducts.css';
import { AiOutlineSearch, AiOutlineFilter, AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from 'react-icons/ai';

const WishGenieProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [formData, setFormData] = useState({
    'Sticker Content Main': '',
    'Sticker Content Sub': '',
    'Category': '',
    'MRP': '',
    'Product code': '',
    'Burn Time': '',
    'Burning Instructions': '',
    'Diameter': '',
    'Fragrances': '',
    'Height Dimensions': '',
    'Jar type': '',
    'Product Description': '',
    'Storage': '',
    'Type of wax': '',
    'Wax color': '',
    'Weight': '',
    'warning': '',
    views: '',
    bought: '',
    image: null
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Categories from data
  const categories = [...new Set(products.map(product => product['Category']).filter(Boolean))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getWishGenieProducts();
      console.log('Fetched Wish Genie products:', data);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get the first image from a comma-separated list
  const getFirstImage = (imageField) => {
    if (!imageField) return null;
    const imagesArr = imageField.split(',').map(img => img.trim()).filter(Boolean);
    if (imagesArr.length > 0) {
      return imagesArr[0].startsWith('/') ? imagesArr[0] : `/${imagesArr[0]}`;
    }
    return null;
  };

  // Function to count images in a comma-separated string
  const countImages = (imageUrl) => {
    if (!imageUrl) return 0;
    return imageUrl.includes(',') ? imageUrl.split(',').length : 1;
  };

  // Function to get all images from a comma-separated string
  const getAllImages = (imageUrl) => {
    if (!imageUrl) return [];
    return imageUrl.includes(',') ? imageUrl.split(',').map(url => url.trim()) : [imageUrl];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'newest'
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      'Sticker Content Main': product['Sticker Content Main'] || '',
      'Sticker Content Sub': product['Sticker Content Sub'] || '',
      'Category': product['Category'] || '',
      'MRP': product['MRP'] || '',
      'Product code': product['Product code'] || '',
      'Burn Time': product['Burn Time'] || '',
      'Burning Instructions': product['Burning Instructions'] || '',
      'Diameter': product['Diameter'] || '',
      'Fragrances': product['Fragrances'] || '',
      'Height Dimensions': product['Height Dimensions'] || '',
      'Jar type': product['Jar type'] || '',
      'Product Description': product['Product Description'] || '',
      'Storage': product['Storage'] || '',
      'Type of wax': product['Type of wax'] || '',
      'Wax color': product['Wax color'] || '',
      'Weight': product['Weight'] || '',
      'warning': product['warning'] || '',
      views: product.views || '',
      bought: product.bought || '',
      image: product.image || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = formData.image;

      if (formData.image && formData.image instanceof File) {
        const timestamp = new Date().getTime();
        const path = `wish_genie/${formData['Product code']}/${timestamp}`;
        imageUrl = await uploadFile(formData.image, path);
      }

      const productData = {
        ...formData,
        image: imageUrl,
        views: formData.views === '' ? 0 : Number(formData.views),
        bought: formData.bought === '' ? 0 : Number(formData.bought),
        updatedAt: new Date()
      };

      if (editingProduct) {
        await updateWishGenieProduct(editingProduct.id, productData);
        setSuccessMessage("Product updated successfully!");
      } else {
        await createWishGenieProduct(productData);
        setSuccessMessage("Product added successfully!");
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        'Sticker Content Main': '',
        'Sticker Content Sub': '',
        'Category': '',
        'MRP': '',
        'Product code': '',
        'Burn Time': '',
        'Burning Instructions': '',
        'Diameter': '',
        'Fragrances': '',
        'Height Dimensions': '',
        'Jar type': '',
        'Product Description': '',
        'Storage': '',
        'Type of wax': '',
        'Wax color': '',
        'Weight': '',
        'warning': '',
        views: '',
        bought: '',
        image: null
      });
      fetchProducts();
    } catch (err) {
      if (err.message && err.message.includes('product code already exists')) {
        setError(`Product with code ${formData['Product code']} already exists`);
      } else {
        setError('Failed to save product');
      }
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteWishGenieProduct(productId);
        setSuccessMessage("Product deleted successfully!");
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      } finally {
        setLoading(false);
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
        setLoading(false);
        return;
      }

      const results = {
        added: [],
        skipped: []
      };

      // Add each product to the database
      for (const product of productsToAdd) {
        try {
          const productData = {
            ...product,
            updatedAt: new Date()
          };
          await createWishGenieProduct(productData);
          results.added.push(product['Product code']);
        } catch (err) {
          if (err.message && err.message.includes('product code already exists')) {
            results.skipped.push(product['Product code']);
          } else {
            throw err;
          }
        }
      }

      // Show summary message
      let message = '';
      if (results.added.length > 0) {
        message += `Successfully added ${results.added.length} products. `;
      }
      if (results.skipped.length > 0) {
        message += `Skipped ${results.skipped.length} duplicate products (codes: ${results.skipped.join(', ')}).`;
      }
      setSuccessMessage(message);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      setShowBulkForm(false);
      setBulkJson('');
      fetchProducts();
    } catch (err) {
      setError('Failed to add products');
      console.error('Error adding products:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Search filter
    const searchMatch = 
      !filters.search || 
      product['Sticker Content Main']?.toLowerCase().includes(filters.search.toLowerCase()) ||
      product['Product code']?.toLowerCase().includes(filters.search.toLowerCase());
    
    // Category filter
    const categoryMatch = !filters.category || product['Category'] === filters.category;
    
    // Price filter
    const priceMin = filters.priceMin ? parseFloat(filters.priceMin) : 0;
    const priceMax = filters.priceMax ? parseFloat(filters.priceMax) : Infinity;
    const price = parseFloat(product['MRP'] || 0);
    const priceMatch = price >= priceMin && price <= priceMax;
    
    return searchMatch && categoryMatch && priceMatch;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return parseFloat(a['MRP'] || 0) - parseFloat(b['MRP'] || 0);
      case 'price-high':
        return parseFloat(b['MRP'] || 0) - parseFloat(a['MRP'] || 0);
      case 'name-asc':
        return (a['Sticker Content Main'] || '').localeCompare(b['Sticker Content Main'] || '');
      case 'name-desc':
        return (b['Sticker Content Main'] || '').localeCompare(a['Sticker Content Main'] || '');
      case 'newest':
      default:
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }
  });

  if (loading && products.length === 0) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading products...</p></div>;

  return (
    <div className="admin-main-container">
      {successMessage && (
        <div className="success-message">
          {successMessage}
          <button className="close-btn" onClick={() => setSuccessMessage(null)}><AiOutlineClose /></button>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
          <button className="close-btn" onClick={() => setError(null)}><AiOutlineClose /></button>
        </div>
      )}
      
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Wish Genie Products</h1>
          <div className="header-buttons">
            <button 
              className="primary-btn"
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  setEditingProduct(null);
                } else {
                  setEditingProduct(null);
                  setFormData({
                    'Sticker Content Main': '',
                    'Sticker Content Sub': '',
                    'Category': '',
                    'MRP': '',
                    'Product code': '',
                    'Burn Time': '',
                    'Burning Instructions': '',
                    'Diameter': '',
                    'Fragrances': '',
                    'Height Dimensions': '',
                    'Jar type': '',
                    'Product Description': '',
                    'Storage': '',
                    'Type of wax': '',
                    'Wax color': '',
                    'Weight': '',
                    'warning': '',
                    image: null
                  });
                  setShowForm(true);
                }
              }}
            >
              <AiOutlinePlus /> {showForm ? 'Cancel' : 'Add Product'}
            </button>
            <button 
              className="secondary-btn"
              onClick={() => setShowBulkForm(!showBulkForm)}
            >
              {showBulkForm ? 'Cancel' : 'Bulk Add'}
            </button>
            <button 
              className="secondary-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <AiOutlineFilter /> {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Section */}
      {showFilters && (
        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search</label>
              <div className="search-input-container">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name or code..."
                  className="search-input"
                />
                <AiOutlineSearch className="search-icon" />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Price Range</label>
              <div className="priceinputs">
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="priceinput"
                />
                <span>to</span>
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="priceinput"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            
            <div className="filter-group filter-actions">
              <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
            </div>
          </div>
        </div>
      )}

      {showBulkForm && (
        <div className="bulk-form-container">
          <div className="form-card">
            <h2>Bulk Add Products</h2>
            <div className="form-group">
              <label>Enter Products JSON:</label>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                placeholder="Enter products in JSON format. Example: [{'Sticker Content Main': 'Product 1', 'Category': 'Luxury/Crystal Candles', ...}, ...]"
                rows="10"
              />
            </div>
            <div className="form-actions">
              <button 
                className="primary-btn"
                onClick={handleBulkAdd}
              >
                Add Products
              </button>
              <button 
                className="secondary-btn"
                onClick={() => {
                  setShowBulkForm(false);
                  setBulkJson('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="product-form-container">
          <div className="form-card">
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Sticker Content Main:</label>
                  <input
                    type="text"
                    name="Sticker Content Main"
                    value={formData['Sticker Content Main']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subtitle:</label>
                  <input
                    type="text"
                    name="Sticker Content Sub"
                    value={formData['Sticker Content Sub']}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    name="Category"
                    value={formData['Category']}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Luxury/Crystal Candles">Luxury/Crystal Candles</option>
                    <option value="Crystal Jewellery">Crystal Jewellery</option>
                    <option value="Journals">Journals</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>MRP:</label>
                  <input
                    type="number"
                    name="MRP"
                    value={formData['MRP']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Product Code:</label>
                  <input
                    type="text"
                    name="Product code"
                    value={formData['Product code']}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Views (people):</label>
                  <input
                    type="number"
                    name="views"
                    value={formData.views}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Bought (people):</label>
                  <input
                    type="number"
                    name="bought"
                    value={formData.bought}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Burn Time:</label>
                  <input
                    type="text"
                    name="Burn Time"
                    value={formData['Burn Time']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Diameter:</label>
                  <input
                    type="text"
                    name="Diameter"
                    value={formData['Diameter']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Height Dimensions:</label>
                  <input
                    type="text"
                    name="Height Dimensions"
                    value={formData['Height Dimensions']}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fragrances:</label>
                  <input
                    type="text"
                    name="Fragrances"
                    value={formData['Fragrances']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Jar Type:</label>
                  <input
                    type="text"
                    name="Jar type"
                    value={formData['Jar type']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type of Wax:</label>
                  <input
                    type="text"
                    name="Type of wax"
                    value={formData['Type of wax']}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Wax Color:</label>
                  <input
                    type="text"
                    name="Wax color"
                    value={formData['Wax color']}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Weight:</label>
                  <input
                    type="text"
                    name="Weight"
                    value={formData['Weight']}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Burning Instructions:</label>
                <textarea
                  name="Burning Instructions"
                  value={formData['Burning Instructions']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Description:</label>
                <textarea
                  name="Product Description"
                  value={formData['Product Description']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Storage Instructions:</label>
                <textarea
                  name="Storage"
                  value={formData['Storage']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Warning:</label>
                <textarea
                  name="warning"
                  value={formData['warning']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Image URL(s):</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleInputChange}
                  placeholder="Enter image URL(s) - separate multiple URLs with commas"
                  required={!editingProduct}
                />
                <div className="image-tip">Note: For multiple images, separate URLs with commas. Only the first image will be displayed in the products list.</div>
                
                {formData.image && (
                  <div className="image-previews">
                    <p className="preview-title">Image Previews:</p>
                    <div className="preview-container">
                      {getAllImages(formData.image).map((url, index) => (
                        <div key={index} className="preview-item">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="image-preview"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Hello+World' }}
                          />
                          <span className="preview-index">{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button 
                  type="button" 
                  className="secondary-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Products by Category</h3>
          <div className="stat-breakdown">
            {categories.map(category => {
              const count = products.filter(p => p['Category'] === category).length;
              return (
                <div key={category} className="stat-item">
                  <span>{category}</span>
                  <span className="stat-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="stat-card">
          <h3>Filtered Results</h3>
          <p className="stat-value">{sortedProducts.length}</p>
        </div>
      </div>

      <div className="products-list-container">
        {sortedProducts.length === 0 ? (
          <div className="no-results">
            <p>No products found matching your filters.</p>
            <button className="secondary-btn" onClick={resetFilters}>Reset Filters</button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Sticker Content Main</th>
                  <th>Category</th>
                  <th>MRP</th>
                  <th>Product Code</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="image-container">
                        <img 
                          src={getFirstImage(product.image)} 
                          alt={product['Sticker Content Main']}
                          className="product-thumbnail"
                          onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Hello+World' }}
                        />
                        {countImages(product.image) > 1 && (
                          <div className="image-count">+{countImages(product.image) - 1}</div>
                        )}
                      </div>
                    </td>
                    <td>{product['Sticker Content Main']}</td>
                    <td>{product['Category']}</td>
                    <td>₹{product['MRP']}</td>
                    <td>{product['Product code']}</td>
                    <td>{product.views || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                        >
                          <AiOutlineEdit /> Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(product.id)}
                        >
                          <AiOutlineDelete /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishGenieProducts; 
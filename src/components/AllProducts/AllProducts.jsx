import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from '../ProductCard/ProductCard';
import {
  FaFilter, FaSortAmountDown, FaSearch, FaTimes, FaLeaf, FaChevronRight,
  FaHome, FaTree, FaSun, FaCloudSun, FaBoxOpen, FaSeedling, FaTools, FaSprayCan
} from "react-icons/fa";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(10000);
  const [careFilter, setCareFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const categories = [
    { name: "All", icon: <FaBoxOpen /> },
    { name: "Indoor", icon: <FaHome /> },
    { name: "Outdoor", icon: <FaTree /> },
    { name: "Succulent", icon: <FaCloudSun /> },
    { name: "Flowering", icon: <FaLeaf /> },
    { name: "Bonsai", icon: <FaSeedling /> },
    { name: "Seeds", icon: <FaSeedling /> },
    { name: "Pots", icon: <FaTools /> },
    { name: "Care", icon: <FaSprayCan /> }
  ];

  const careLevels = ["All", "Easy", "Moderate", "High"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsArr);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryName) {
      // Decode URL (e.g., "Indoor%20Plants" -> "Indoor Plants")
      const decoded = decodeURIComponent(categoryName);

      // Try to find a match in our categories list
      const found = categories.find(c =>
        c.name.toLowerCase() === decoded.toLowerCase() ||
        decoded.toLowerCase().includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(decoded.toLowerCase())
      );

      if (found) {
        setSelectedCategory(found.name);
      } else if (decoded.toLowerCase() === "all-products") {
        setSelectedCategory("All");
      } else {
        // Fallback: Capitalize first letter of each word
        const formatted = decoded.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setSelectedCategory(formatted);
      }
    } else {
      setSelectedCategory("All");
    }
  }, [categoryName]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = !searchQuery ||
        (product.plantName || product.product_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" ||
        (product.category || "").toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes((product.category || "").toLowerCase());
      const matchesPrice = (product.discountPrice || product.price || 0) <= priceRange;
      const matchesCare = careFilter === "All" || product.maintenanceLevel === careFilter;

      return matchesSearch && matchesCategory && matchesPrice && matchesCare;
    });

    if (sortBy === "priceLow") result.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
    if (sortBy === "priceHigh") result.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
    if (sortBy === "newest") result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, careFilter, sortBy]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 bg-cream min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-xs">Loading Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-4 md:px-12">

        <div className="flex flex-col lg:flex-row gap-16">

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  <FaFilter size={14} />
                </div>
                <h3 className="text-2xl font-display font-black text-primary uppercase tracking-tighter">Filters</h3>
              </div>

              {/* Categories with Icons */}
              <div className="mb-12">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8">Collections</h4>
                <div className="flex flex-col gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`text-left group flex items-center justify-between p-4 rounded-2xl transition-all ${selectedCategory === cat.name
                        ? "bg-white text-primary shadow-xl shadow-primary/5 border border-gray-100"
                        : "text-gray-400 hover:text-primary hover:bg-white/50"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`text-lg transition-transform duration-500 ${selectedCategory === cat.name ? "text-accent scale-110" : "text-gray-300 group-hover:text-primary"}`}>
                          {cat.icon}
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest">{cat.name} Plants</span>
                      </div>
                      <FaChevronRight size={10} className={`transition-all duration-500 ${selectedCategory === cat.name ? "translate-x-0 opacity-100 text-accent" : "-translate-x-2 opacity-0"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6">Price Range</h4>
                <input
                  type="range" min="0" max="10000" step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer mb-6"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 italic">Up to</span>
                  <span className="text-xl font-display font-black text-primary">₹{priceRange}</span>
                </div>
              </div>

              {/* Care Level */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6">Experience</h4>
                <div className="flex flex-wrap gap-2">
                  {careLevels.map(level => (
                    <button
                      key={level}
                      onClick={() => setCareFilter(level)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${careFilter === level ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" : "bg-gray-50 text-gray-400 border-transparent hover:border-primary hover:text-primary"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-grow">

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-4 block underline decoration-accent underline-offset-8">Collection</span>
                <h2 className="text-4xl md:text-6xl font-display font-black text-primary leading-none tracking-tighter uppercase">
                  {selectedCategory} <br /> <span className="text-accent">Section</span>
                </h2>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative group flex-grow md:flex-grow-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-100 px-10 py-5 rounded-2xl text-xs font-black text-primary uppercase tracking-[0.2em] focus:outline-none focus:border-accent shadow-sm cursor-pointer min-w-[240px]"
                  >
                    <option value="featured">Featured First</option>
                    <option value="newest">New Arrivals</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                  <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={14} />
                  <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 rotate-90" size={10} />
                </div>

                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden p-5 bg-primary text-white rounded-2xl shadow-2xl flex items-center gap-3 font-black uppercase text-xs tracking-widest"
                >
                  <FaFilter /> Filters
                </button>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-40 text-center bg-white rounded-[4rem] shadow-2xl border border-gray-50 px-10">
                <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-10 text-primary/20">
                  <FaSearch size={44} />
                </div>
                <h3 className="text-4xl font-display font-black text-primary mb-4 uppercase tracking-tighter">No plants found</h3>
                <p className="text-gray-400 mb-12 max-w-sm mx-auto font-medium italic">Adjust your filters or search query to find your green friend.</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setPriceRange(10000); setCareFilter("All"); }}
                  className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-700 ${showMobileFilters ? "visible" : "invisible"}`}>
        <div
          className={`absolute inset-0 bg-primary/80 backdrop-blur-xl transition-opacity duration-700 ${showMobileFilters ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowMobileFilters(false)}
        />
        <div className={`absolute bottom-0 left-0 right-0 bg-cream rounded-t-[4rem] p-12 transition-transform duration-700 max-h-[90vh] overflow-y-auto ${showMobileFilters ? "translate-y-0" : "translate-y-full"}`}>
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-display font-black text-primary uppercase tracking-tighter">Refine Search</h3>
            <button onClick={() => setShowMobileFilters(false)} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-lg">
              <FaTimes />
            </button>
          </div>

          <div className="space-y-12">
            <div>
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8">Categories</h4>
              <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest border transition-all flex flex-col items-center gap-3 ${selectedCategory === cat.name ? 'bg-primary text-white border-primary shadow-2xl' : 'bg-white text-gray-400 border-transparent'}`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8">Price (Under ₹{priceRange})</h4>
              <input
                type="range" min="0" max="10000" step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => setShowMobileFilters(false)}
            className="w-full bg-accent text-white py-6 rounded-[2rem] font-black mt-16 text-xl shadow-2xl shadow-accent/40 uppercase tracking-widest"
          >
            Show {filteredProducts.length} Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

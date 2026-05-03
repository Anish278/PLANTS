import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard/ProductCard';
import { FaArrowRight, FaSearch } from 'react-icons/fa';

const HomeAllProducts = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Show up to 8 products on the homepage
  const displayProducts = products.slice(0, 8);

  if (loading) return (
    <div className="py-20 flex justify-center bg-cream">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="text-accent font-bold text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-accent underline-offset-8">Our Collection</span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-primary leading-none tracking-tighter">
              Explore Our Full <br/> <span className="text-accent">Plant Range</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/all-products')}
            className="group flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-accent transition-all shadow-2xl shadow-primary/20"
          >
            View Entire Shop <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-100">
             <FaSearch className="mx-auto text-gray-200 mb-6" size={50} />
             <p className="text-gray-400 font-medium italic">Your collection is currently growing. Check back soon!</p>
          </div>
        )}

        <div className="mt-20 text-center">
            <p className="text-gray-400 font-medium mb-8">Can't find what you're looking for?</p>
            <button 
              onClick={() => navigate('/all-products')}
              className="text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-all"
            >
              Browse by Category
            </button>
        </div>
      </div>
    </section>
  );
};

export default HomeAllProducts;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard/ProductCard';
import { FaArrowRight } from 'react-icons/fa';

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  const featured = products.filter(p => p.featured).slice(0, 4);

  if (loading) return (
    <div className="py-20 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-sm font-bold text-accent tracking-[0.2em] uppercase mb-3 underline decoration-accent underline-offset-8">Shop Our Best</h2>
            <h3 className="text-4xl md:text-5xl font-display font-black text-primary leading-none tracking-tighter">Featured Plants</h3>
          </div>
          <button 
            onClick={() => navigate('/all-products')}
            className="flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors group uppercase text-xs tracking-widest"
          >
            Explore All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

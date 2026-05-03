import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const categories = [
  {
    name: "Flowering Plants",
    image: "https://images.unsplash.com/photo-1597055113941-8f5370d0b043?auto=format&fit=crop&w=600&q=80",
    path: "/category/Flowering",
    count: "120+ Products"
  },
  {
    name: "Foliage Plants",
    image: "https://images.unsplash.com/photo-1512428559083-a400a3b8463a?auto=format&fit=crop&w=600&q=80",
    path: "/category/Indoor",
    count: "85+ Products"
  },
  {
    name: "Succulents",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=80",
    path: "/category/Succulent",
    count: "60+ Products"
  },
  {
    name: "Indoor Palms",
    image: "https://images.unsplash.com/photo-1510265119258-db115b0e8172?auto=format&fit=crop&w=600&q=80",
    path: "/category/Indoor",
    count: "45+ Products"
  }
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Categories</h2>
            <h3 className="text-4xl font-display font-extrabold text-forest">Popular Collections</h3>
          </div>
          <button 
            onClick={() => navigate('/all-products')}
            className="flex items-center gap-2 text-forest font-bold hover:text-primary transition-colors group"
          >
            View All Categories <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <div 
              key={index}
              onClick={() => navigate(cat.path)}
              className="group cursor-pointer relative h-[400px] overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <p className="text-primary-light text-xs font-bold uppercase tracking-wider mb-2">{cat.count}</p>
                <h4 className="text-2xl font-display font-bold text-white mb-4">{cat.name}</h4>
                <div className="w-12 h-1 bg-primary group-hover:w-24 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

import React from 'react';
import { Link } from 'react-router-dom';

const CircularCategory = () => {
  const categories = [
    { name: "Indoor", image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80", count: "120+ Products" },
    { name: "Flowering", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80&v=2", count: "85+ Products" },
    { name: "Succulents", image: "https://images.unsplash.com/photo-1519336056116-bc0f1771dec8?auto=format&fit=crop&w=600&q=80&v=2", count: "50+ Products" },
    { name: "Foliage", image: "https://images.unsplash.com/photo-1510265119258-db115b0e8172?auto=format&fit=crop&w=600&q=80", count: "95+ Products" },
    { name: "Seeds", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80", count: "200+ Products" },
    { name: "Pots", image: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?auto=format&fit=crop&w=600&q=80", count: "150+ Products" },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-black text-primary uppercase tracking-tighter">Shop by Category</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Find your perfect match</p>
          </div>
          <Link to="/all-products" className="text-accent font-bold text-xs uppercase tracking-widest hover:underline underline-offset-8">View All Collections</Link>
        </div>

        <div className="flex gap-8 md:gap-12 overflow-x-auto pb-8 scroll-container justify-start lg:justify-between px-2">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/category/${cat.name}`}
              className="flex flex-col items-center group shrink-0"
            >
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden mb-6 border-4 border-transparent group-hover:border-primary transition-all duration-500 shadow-xl group-hover:shadow-primary/20 p-2">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest group-hover:text-accent transition-colors">{cat.name}</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CircularCategory;

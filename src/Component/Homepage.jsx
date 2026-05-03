import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero/Hero";
import CircularCategory from "../components/CircularCategory";
import CareTipsSection from "../components/CareTipsSection";
import FeaturedProducts from "../components/FeaturedProducts";
import HomeAllProducts from "../components/HomeAllProducts";
import HomeNewsletter from "../components/HomeNewsletter";
import FeaturesSection from "../components/FeaturesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import InstagramFeed from "../components/InstagramFeed";
import { FaArrowRight, FaInstagram } from "react-icons/fa";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-cream">
      <Hero />
      <CircularCategory />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Middle Video Section */}
      <section className="py-12 bg-cream">
        <div className="container mx-auto px-4 md:px-8">
          <video
            src="https://res.cloudinary.com/drzgk4yba/video/upload/v1777742994/animation_yplsus.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full rounded-[2rem] shadow-2xl object-cover"
          />
        </div>
      </section>

      {/* Full Collection Section */}
      <HomeAllProducts />

      {/* Featured Collections Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Pet Friendly"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                <h3 className="text-3xl font-display font-black text-white mb-4">Pet Friendly Plants</h3>
                <p className="text-white/70 mb-8 max-w-xs text-sm font-medium">Safe and beautiful green friends for your furry companions.</p>
                <button
                  onClick={() => navigate('/all-products')}
                  className="w-fit bg-accent text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-white hover:text-primary transition-all flex items-center gap-2"
                >
                  Shop Now <FaArrowRight size={12} />
                </button>
              </div>
            </div>
            <div className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Easy Care"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-12 flex flex-col justify-end">
                <h3 className="text-3xl font-display font-black text-white mb-4">Beginner's Choice</h3>
                <p className="text-white/70 mb-8 max-w-xs text-sm font-medium">Low maintenance plants for those just starting their journey.</p>
                <button
                  onClick={() => navigate('/all-products')}
                  className="w-fit bg-accent text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-white hover:text-primary transition-all flex items-center gap-2"
                >
                  Shop Now <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features are now moved lower */}
      <CareTipsSection />
      <FeaturesSection />
      <InstagramFeed />
      <HomeNewsletter />
    </div>
  );
};

export default Homepage;

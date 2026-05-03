import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Plant Parent",
    content: "The plants arrived in perfect condition! I was worried about shipping, but the packaging was amazing. My Monstera is thriving in its new home.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "David Chen",
    role: "Interior Designer",
    content: "As a designer, I always look for high-quality greenery. PlantVigor has the best selection of rare plants that really elevate any space I work on.",
    avatar: "https://i.pravatar.cc/150?u=david"
  },
  {
    name: "Emily Rodriguez",
    role: "Urban Gardener",
    content: "Their customer support is top-notch. I had some questions about my succulent's care and they responded within an hour with expert advice.",
    avatar: "https://i.pravatar.cc/150?u=emily"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-accent tracking-[0.2em] uppercase mb-3 underline decoration-accent underline-offset-8">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-display font-black text-primary uppercase tracking-tighter">What Our Green Community Says</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="relative p-10 bg-white rounded-[3rem] hover:bg-primary hover:text-white transition-all duration-500 group shadow-sm hover:shadow-2xl">
              <FaQuoteLeft className="text-4xl text-primary/20 group-hover:text-white/20 absolute top-8 left-8" />
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={14} />
                  ))}
                </div>
                <p className="text-lg mb-8 leading-relaxed italic">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
                  <div>
                    <h4 className="font-bold text-primary group-hover:text-white transition-colors">{t.name}</h4>
                    <p className="text-sm text-gray-400 group-hover:text-white/70 transition-colors">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

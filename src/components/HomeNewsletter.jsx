import React from 'react';
import { FaPaperPlane, FaLeaf } from 'react-icons/fa';

const HomeNewsletter = () => {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative rounded-[3rem] bg-primary p-12 md:p-24 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1512428559083-a400a3b8463a?auto=format&fit=crop&w=1200&q=80"
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
              alt="Newsletter BG"
            />
          </div>
          <FaLeaf className="absolute top-12 right-12 text-white/5 text-9xl rotate-45" />

          <div className="relative z-10 md:w-1/2">
            <span className="text-accent font-bold text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-accent underline-offset-8">Join The Circle</span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-none tracking-tighter">
              Get <span className="text-accent">10% Off</span> Your <br /> First Green Friend
            </h2>
            <p className="text-white/60 text-lg md:text-xl font-medium max-w-md">
              Subscribe to our newsletter for plant care tips, exclusive offers, and early access to new arrivals.
            </p>
          </div>

          <div className="relative z-10 md:w-1/2 w-full">
            <form className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-8 py-5 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-all text-lg font-bold"
                />
                <FaPaperPlane className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20" />
              </div>
              <button className="bg-accent hover:bg-white text-white hover:text-primary px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-accent/20 transition-all duration-500 uppercase tracking-widest">
                Subscribe Now
              </button>
              <p className="text-white/30 text-[10px] text-center font-bold uppercase tracking-widest mt-2">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeNewsletter;

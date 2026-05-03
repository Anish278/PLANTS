import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter, FaLeaf } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Company Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
                <span className="text-xl font-bold">P</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-extrabold text-white leading-none tracking-tight">PlantVigor</span>
                <span className="text-[10px] font-bold text-primary tracking-[0.2em] leading-none mt-1 uppercase">Nature's Best</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              We bring the beauty of nature right to your doorstep. Our plants are ethically sourced and nurtured with love to ensure they thrive in your home.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <FaInstagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <FaPinterestP size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Shop Categories</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/category/Indoor" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Indoor Plants</Link></li>
              <li><Link to="/category/Outdoor" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Outdoor Plants</Link></li>
              <li><Link to="/category/Succulent" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Succulents</Link></li>
              <li><Link to="/category/Flowering" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Flowering Plants</Link></li>
              <li><Link to="/category/Bonsai" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Bonsai Special</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Customer Support</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/track-order" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Track Your Order</Link></li>
              <li><Link to="/returns-exchange" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Returns & Exchange</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Shipping Policy</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm font-medium">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button className="bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-accent/20">
                Subscribe Now
              </button>
            </form>
          </div>

        </div>

        <hr className="border-white/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© 2026 PlantVigor Nursery. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

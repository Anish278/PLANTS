import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes,
  FaChevronDown, FaTruck, FaInstagram, FaFacebook, FaYoutube, FaTwitter
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AnnouncementBar from "./AnnouncementBar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearch(false);
    setActiveMenu(null);
  }, [location]);

  const menuItems = [
    {
      name: "Plants",
      path: "/all-products",
      dropdown: [
        "Indoor Plants", "Succulent Plants", "Cactus", "Air Purifying Plants",
        "Hardy Plants", "Adenium Plants", "Vastu Plants", "Medicinal Plants",
        "House Plants", "Outdoor Plants", "Flowering Plants", "Summer Plants",
        "Hanging Plants", "Plants for Bathroom", "Plants for Bedroom",
        "Plants for Kitchen", "Plants for Office", "Oxygen Plants"
      ]
    },
    {
      name: "Seeds",
      path: "/category/Seeds",
      dropdown: ["Summer Seeds", "Winter Flower Seeds", "Fruit Seeds", "Herb Seeds"]
    },
    {
      name: "Pots & Planters",
      path: "/category/Pots",
      dropdown: ["Resin Pots", "Metal Pots", "Coir Pots", "Self Watering Pots", "Plastic Pots", "Net Pots", "Ceramic Pots"]
    },
    {
      name: "Plant Care",
      path: "/category/Plant Care",
      dropdown: ["Garden Tools", "Fertilizers & Soil", "Manures", "Self Watering Pots"]
    },
    {
      name: "Accessories",
      path: "/category/Accessories",
      dropdown: ["Miniatures", "Pebbles", "Key chains"]
    },
    { name: "Combos", path: "/category/Combos" },
    { name: "Our Story", path: "/about" },
    { name: "Bulk Order", path: "/bulk-order" },
    { name: "Track Order", path: "/track-order" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <AnnouncementBar />

      {/* Top Bar (Desktop Only) */}
      <div className="hidden lg:flex bg-cream border-b border-gray-100 py-1.5 px-12 justify-between items-center text-[10px] font-bold text-primary/60 uppercase tracking-widest">
        <div className="flex gap-4">
          <FaFacebook className="hover:text-accent cursor-pointer transition-colors" />
          <FaInstagram className="hover:text-accent cursor-pointer transition-colors" />
          <FaYoutube className="hover:text-accent cursor-pointer transition-colors" />
          <FaTwitter className="hover:text-accent cursor-pointer transition-colors" />
        </div>
        <div className="flex items-center gap-6">
          <Link to="/track-order" className="hover:text-accent flex items-center gap-1.5"><FaTruck /> Track Your Order</Link>
          <Link to="/contact" className="hover:text-accent">Support</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-500 border-b ${isScrolled ? "bg-white/95 backdrop-blur-md py-4 shadow-xl border-gray-100" : "bg-white py-6 border-transparent"
        }`}>
        <div className="container mx-auto px-4 md:px-12 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0 group">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl md:rounded-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="text-lg md:text-xl font-black">P</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-display font-black text-primary leading-none tracking-tighter">PlantVigor</span>
              <span className="text-[7px] md:text-[8px] font-black text-accent tracking-[0.4em] leading-none mt-1">NATURE'S BEST</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative h-full py-2"
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  to={item.path}
                  className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all ${location.pathname === item.path ? "text-accent" : "text-primary hover:text-accent"
                    }`}
                >
                  {item.name}
                  {item.dropdown && <FaChevronDown size={8} className={`transition-transform duration-300 ${activeMenu === item.name ? "rotate-180" : ""}`} />}
                </Link>

                {item.dropdown && activeMenu === item.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 animate-fade-in z-50">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 py-6 min-w-[240px] overflow-hidden">
                      <div className="max-h-[60vh] overflow-y-auto px-4 scrollbar-hide">
                        {item.dropdown.map(sub => (
                          <Link
                            key={sub}
                            to={`/category/${sub}`}
                            className="block px-6 py-3 text-[10px] font-bold text-gray-400 hover:text-primary hover:bg-cream rounded-xl transition-all uppercase tracking-widest"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 md:gap-4">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-primary hover:text-accent transition-all relative group"
            >
              <FaSearch size={18} />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </button>

            <Link to={isAuthenticated ? "/profile" : "/login"} className="p-2 text-primary hover:text-accent transition-all relative group hidden md:block">
              <FaUser size={18} />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>

            <Link to="/cart" className="p-2 text-primary hover:text-accent transition-all relative group">
              <div className="relative">
                <FaShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg border border-white">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-primary hover:text-accent transition-all"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-primary/95 backdrop-blur-xl z-[100] animate-fade-in flex flex-col p-8 md:p-24">
          <button
            onClick={() => setShowSearch(false)}
            className="absolute top-12 right-12 text-white/40 hover:text-white transition-all hover:rotate-90 duration-500"
          >
            <FaTimes size={40} />
          </button>

          <div className="max-w-4xl mx-auto w-full mt-24">
            <span className="text-accent font-bold text-xs uppercase tracking-[0.4em] mb-4 block underline decoration-accent underline-offset-8">Quick Search</span>
            <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-12 tracking-tighter leading-none">
              Looking for <br /> <span className="text-accent">Something Green?</span>
            </h2>
            <div className="relative group">
              <input
                autoFocus
                type="text"
                placeholder="Type your search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/all-products?search=${searchQuery.trim()}`);
                    setShowSearch(false);
                  }
                }}
                className="w-full bg-transparent border-b-4 border-white/20 text-3xl md:text-5xl py-8 font-display font-medium text-white placeholder:text-white/10 focus:outline-none focus:border-accent transition-all"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/all-products?search=${searchQuery.trim()}`);
                    setShowSearch(false);
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-all hover:scale-110"
              >
                <FaSearch size={40} />
              </button>
            </div>

            <div className="mt-16 flex flex-wrap gap-4">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] w-full mb-4">Popular Collection</span>
              {["Snake Plants", "Air Purifiers", "Pots & Tools", "Best Sellers"].map(tag => (
                <button key={tag} className="px-8 py-4 bg-white/5 hover:bg-accent text-white rounded-2xl text-xs font-bold transition-all border border-white/10 hover:border-accent uppercase tracking-widest">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Navigation */}
      <div className={`fixed inset-0 bg-primary/80 backdrop-blur-md z-[110] transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white transition-transform duration-500 shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-10 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-16 border-b border-gray-100 pb-6">
              <span className="text-2xl font-display font-black text-primary tracking-tighter uppercase">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {menuItems.map((item) => (
                <div key={item.name} className="flex flex-col gap-4">
                  <Link
                    to={item.path}
                    className="text-xl font-display font-black text-primary hover:text-accent transition-all uppercase tracking-tight flex items-center justify-between"
                  >
                    {item.name}
                    {item.dropdown && <FaChevronDown size={12} className="text-gray-300" />}
                  </Link>
                  {item.dropdown && (
                    <div className="flex flex-wrap gap-2 pl-4">
                      {item.dropdown.slice(0, 6).map(sub => (
                        <Link key={sub} to={`/category/${sub}`} className="text-[10px] font-bold text-gray-400 hover:text-accent border border-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                          {sub}
                        </Link>
                      ))}
                      {item.dropdown.length > 6 && <span className="text-[10px] font-bold text-gray-300 italic">+{item.dropdown.length - 6} more...</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col gap-8">
              <Link to="/track-order" className="flex items-center gap-4 text-primary font-black uppercase text-xs tracking-widest">
                <FaTruck className="text-accent" /> Track Your Order
              </Link>
              <div className="flex gap-4">
                {[FaFacebook, FaInstagram, FaYoutube, FaTwitter].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all cursor-pointer shadow-sm">
                    <Icon />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

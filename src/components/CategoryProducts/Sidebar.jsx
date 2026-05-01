import React from "react";
import { NavLink } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useFilters } from "../../context/FilterContext";
import { 
  FiShoppingBag, 
  FiTag, 
  FiSliders
} from "react-icons/fi";
import { 
  FaLeaf, 
  FaTree, 
  FaSeedling, 
  FaTools, 
  FaFlask, 
  FaHandHoldingHeart, 
  FaBoxOpen,
  FaPalette,
  FaBoxes,
  FaVial,
  FaAppleAlt
} from "react-icons/fa";

const format = (str) =>
  str?.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-");

const Sidebar = () => {
  const { products } = useProducts();
  const filterContext = useFilters() || {};
  const { handleClearFilters = () => {} } = filterContext;

  const categories = [
    { name: "All Products", id: "all", icon: <FiShoppingBag /> },
    { name: "Indoor Plants", id: "indoor-plants", icon: <FaLeaf /> },
    { name: "Outdoor Plants", id: "outdoor-plants", icon: <FaTree /> },
    { name: "Succulents & Cacti", id: "succulents-cacti", icon: <FaAppleAlt /> }, // Fallback for cactus
    { name: "Pots & Planters", id: "pots-planters", icon: <FaBoxes /> },
    { name: "Soil & Growing Media", id: "soil-media", icon: <FaSeedling /> },
    { name: "Fertilizers & Plant Food", id: "fertilizers", icon: <FaFlask /> },
    { name: "Gardening Tools", id: "tools", icon: <FaTools /> },
    { name: "Plant Care Products", id: "care-products", icon: <FaHandHoldingHeart /> },
    { name: "Seeds & Saplings", id: "seeds-saplings", icon: <FaSeedling /> },
    { name: "Garden Decor", id: "decor", icon: <FaPalette /> },
    { name: "DIY Garden Kits", id: "kits", icon: <FaBoxOpen /> }
  ];

  return (
    <aside className="category-filters">
      <div className="filter-header-v3">
        <FiSliders className="header-icon" />
        <h3>Filters</h3>
      </div>

      <div className="filter-section-v3">
        <div className="section-title">
          <FiTag className="section-icon" />
          <span>Categories</span>
        </div>
        
        <div className="category-list-v3">
          {categories.map((cat) => {
            const path = cat.id === 'all' ? '/all-products' : `/category/${cat.id}`;
            
            return (
              <NavLink 
                key={cat.id} 
                to={path}
                className={({ isActive }) => 
                  `cat-item-v3 ${isActive ? "active" : ""}`
                }
              >
                <span className="item-icon">{cat.icon}</span>
                <span className="item-name">{cat.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

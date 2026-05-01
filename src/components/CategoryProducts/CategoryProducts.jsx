import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CategoryProducts.css";
import ProductCard from "../ProductCard/ProductCard";
import Sidebar from "./Sidebar";

// 🔥 CATEGORY MATCH FIX
const format = (str) =>
  str?.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-");

const CategoryProducts = () => {
  const { categoryName } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [0, 150000],
    types: [],
    brands: [],
    showDiscounted: false,
  });

  // 🔥 FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("../../firebase/config");

        const snapshot = await getDocs(collection(db, "products"));

        const data = [];
        snapshot.forEach((doc) => {
          const d = doc.data();

          data.push({
            id: doc.id,
            name: d.product_name || d.name,
            price: d.mrp || d.price || 0,
            discount: d.discount || 0,
            image: d.image || "",
            brand: d.brand || "",
            type: d.type || "", // 🌱 important
            category: d.category || "",
            subcategory: d.subcategory || "",
            inventory: d.inventory ?? 1,
          });
        });

        // 🔥 CATEGORY FILTER
        const filtered = data.filter((p) => {
          if (categoryName === "all") return true;

          return (
            format(p.category) === format(categoryName) ||
            format(p.subcategory) === format(categoryName)
          );
        });

        setProducts(filtered);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const priceMatch =
      p.price >= selectedFilters.priceRange[0] &&
      p.price <= selectedFilters.priceRange[1];

    const typeMatch =
      selectedFilters.types.length === 0 ||
      selectedFilters.types.includes(p.type);

    const brandMatch =
      selectedFilters.brands.length === 0 ||
      selectedFilters.brands.includes(p.brand);

    const discountMatch =
      !selectedFilters.showDiscounted ||
      (p.discount && p.discount > 0);

    return priceMatch && typeMatch && brandMatch && discountMatch;
  });

  return (
    <div className="category-products">
      <h1 className="title">{categoryName}</h1>

      <div className="category-content">
        <Sidebar
          selectedFilters={selectedFilters}
          handleFilterChange={(type, value) =>
            setSelectedFilters((prev) => ({
              ...prev,
              [type]: value,
            }))
          }
          handleClearFilters={() =>
            setSelectedFilters({
              priceRange: [0, 150000],
              types: [],
              brands: [],
              showDiscounted: false,
            })
          }
          relevantBrands={[...new Set(products.map((p) => p.brand))]}
        />

        <div className="products-grid">
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
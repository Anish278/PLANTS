import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();
export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: [0, 150000],
    types: [],
    brands: [],
    showDiscounted: false,
  });

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      priceRange: [0, 150000],
      types: [],
      brands: [],
      showDiscounted: false,
    });
  };

  return (
    <FilterContext.Provider value={{ selectedFilters, handleFilterChange, handleClearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

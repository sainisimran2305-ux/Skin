import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products';
import { INGREDIENTS as STATIC_INGREDIENTS } from '../data/ingredients';

const ProductContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [ingredients, setIngredients] = useState(STATIC_INGREDIENTS);
  const [loading, setLoading] = useState(true);
  const [backendActive, setBackendActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try fetching products from API
        const productsRes = await fetch(`${API_BASE_URL}/api/products/`);
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const dbProducts = await productsRes.json();
        
        // Try fetching ingredients
        const ingredientsRes = await fetch(`${API_BASE_URL}/api/ingredients/`);
        if (!ingredientsRes.ok) throw new Error('Failed to fetch ingredients');
        const dbIngredients = await ingredientsRes.json();
        if (!ingredientsRes.ok) throw new Error('Failed to fetch ingredients');
        const dbIngredients = await ingredientsRes.json();
        
        setProducts(dbProducts);
        setIngredients(dbIngredients);
        setBackendActive(true);
        console.log('Successfully connected to Python FastAPI Backend & seeded MongoDB.');
      } catch (err) {
        console.warn('Backend API connection failed, falling back to static local data:', err.message);
        setProducts(STATIC_PRODUCTS);
        setIngredients(STATIC_INGREDIENTS);
        setBackendActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider value={{ products, ingredients, loading, backendActive }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

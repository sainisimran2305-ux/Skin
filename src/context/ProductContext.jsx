import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products';
import { INGREDIENTS as STATIC_INGREDIENTS } from '../data/ingredients';

const ProductContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'prakriti_products_v3';

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read products from localStorage:', e);
    }
    return STATIC_PRODUCTS;
  });

  const [ingredients, setIngredients] = useState(STATIC_INGREDIENTS);
  const [loading, setLoading] = useState(true);
  const [backendActive, setBackendActive] = useState(false);

  // Sync to local storage whenever products state changes
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  };

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
        
        // Only override if localStorage has no customized data yet
        const hasCustomData = localStorage.getItem(STORAGE_KEY);
        if (!hasCustomData && Array.isArray(dbProducts) && dbProducts.length > 0) {
          setProducts(dbProducts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbProducts));
        }
        setIngredients(dbIngredients);
        setBackendActive(true);
        console.log('Successfully connected to Python FastAPI Backend & seeded MongoDB.');
      } catch (err) {
        console.warn('Backend API connection offline/not reachable, using local storage state:', err.message);
        setBackendActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 1. Update Product Details
  const updateProduct = async (id, updatedFields) => {
    const updatedList = products.map((item) => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });

    saveProducts(updatedList);

    // If backend is active, sync with backend PUT endpoint
    if (backendActive) {
      try {
        await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields),
        });
      } catch (err) {
        console.warn('Failed to sync updated product with backend API:', err);
      }
    }

    return { success: true };
  };

  // 2. Quick Price Modifier
  const updatePrice = async (id, newPrice, newOriginalPrice = undefined) => {
    const product = products.find((p) => p.id === id);
    if (!product) return { success: false, error: 'Product not found' };

    const updates = {
      price: Number(newPrice),
    };
    if (newOriginalPrice !== undefined) {
      updates.originalPrice = newOriginalPrice === null || newOriginalPrice === '' ? null : Number(newOriginalPrice);
    }

    return await updateProduct(id, updates);
  };

  // 3. Add New Product
  const addProduct = async (productData) => {
    // Generate slug id if none provided
    const baseSlug = (productData.name || 'new-product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    let generatedId = productData.id || baseSlug;
    if (products.some((p) => p.id === generatedId)) {
      generatedId = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newProduct = {
      id: generatedId,
      name: productData.name || 'Botanical Formula',
      subtitle: productData.subtitle || 'Wild-Harvested Pure Skincare',
      category: productData.category || 'serums',
      categoryLabel: productData.categoryLabel || 'Face Serums',
      price: Number(productData.price) || 999,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      rating: Number(productData.rating) || 5.0,
      reviewsCount: Number(productData.reviewsCount) || 1,
      badge: productData.badge || 'New Ritual',
      skinType: Array.isArray(productData.skinType) && productData.skinType.length > 0 
        ? productData.skinType 
        : ['all'],
      volumeOptions: Array.isArray(productData.volumeOptions) && productData.volumeOptions.length > 0
        ? productData.volumeOptions
        : ['50ml'],
      selectedVolume: productData.selectedVolume || (productData.volumeOptions?.[0] || '50ml'),
      image: productData.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      secondaryImage: productData.secondaryImage || null,
      description: productData.description || 'Artisanal cold-pressed botanicals crafted for radiant cellular vitality.',
      keyIngredients: Array.isArray(productData.keyIngredients) && productData.keyIngredients.length > 0
        ? productData.keyIngredients
        : ['Organic Botanical Extract'],
      benefits: Array.isArray(productData.benefits) && productData.benefits.length > 0
        ? productData.benefits
        : ['Deep hydration and nutrient nourishment', 'Protects skin barrier'],
      usage: productData.usage || 'Apply a few drops or gentle pump onto clean skin and massage softly.',
      ritualTime: productData.ritualTime || 'Daily AM & PM',
    };

    const updatedList = [newProduct, ...products];
    saveProducts(updatedList);

    if (backendActive) {
      try {
        await fetch(`${API_BASE_URL}/api/products/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });
      } catch (err) {
        console.warn('Failed to add product to backend:', err);
      }
    }

    return { success: true, product: newProduct };
  };

  // 4. Delete Product
  const deleteProduct = async (id) => {
    const updatedList = products.filter((p) => p.id !== id);
    saveProducts(updatedList);

    if (backendActive) {
      try {
        await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn('Failed to delete product from backend:', err);
      }
    }

    return { success: true };
  };

  // 5. Bulk Price Adjustment (e.g. +10% or -15% sale)
  const bulkAdjustPrices = async (percentageChange, category = 'all') => {
    const factor = 1 + percentageChange / 100;
    const updatedList = products.map((item) => {
      if (category === 'all' || item.category === category) {
        const currentPrice = item.price;
        const newPrice = Math.round(currentPrice * factor);
        
        // If applying discount, keep current price as originalPrice if not already set
        let originalPrice = item.originalPrice;
        if (percentageChange < 0) {
          originalPrice = originalPrice || currentPrice;
        } else if (percentageChange > 0 && originalPrice && newPrice >= originalPrice) {
          originalPrice = null;
        }

        return {
          ...item,
          price: Math.max(99, newPrice),
          originalPrice,
        };
      }
      return item;
    });

    saveProducts(updatedList);
    return { success: true, count: updatedList.length };
  };

  // 6. Reset to Factory Default Catalog
  const resetToDefaults = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setProducts(STATIC_PRODUCTS);
      if (backendActive) {
        await fetch(`${API_BASE_URL}/api/products/reset-defaults`, {
          method: 'POST',
        });
      }
    } catch (err) {
      console.warn('Error resetting defaults:', err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        ingredients,
        loading,
        backendActive,
        updateProduct,
        updatePrice,
        addProduct,
        deleteProduct,
        bulkAdjustPrices,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

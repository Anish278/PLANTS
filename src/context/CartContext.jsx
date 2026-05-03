import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useAuthRedirect } from "../utils/authUtils";
import { db, auth } from '../firebase/config';
import { 
  getActiveCart, 
  createActiveCart, 
  updateCart, 
  saveCartHistory, 
  clearCart 
} from '../firebase/firestore';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { requireAuth } = useAuthRedirect();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const activeCart = await getActiveCart(user.email);
          if (activeCart) {
            setCart(activeCart.items || []);
            setCartId(activeCart.id);
            setSelectedItems(activeCart.items || []);
          } else {
            const newCart = await createActiveCart(user.email);
            setCart([]);
            setSelectedItems([]);
            setCartId(newCart.id);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
          setCart([]);
          setSelectedItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCart([]);
        setSelectedItems([]);
        setCartId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  // Save cart to Firestore
  const saveCartToFirestore = async (newCart) => {
    const user = auth.currentUser;
    if (!user?.email || !cartId) return;

    try {
      await updateCart(cartId, newCart);
      await saveCartHistory(user.email, newCart);
    } catch (error) {
      console.error('Error saving cart to Firestore:', error);
      throw error;
    }
  };

  const addToCart = async (product, size = "default", quantity = 1, navigate) => {
    const user = auth.currentUser;
    
    if (!user) {
      if (navigate) navigate('/login');
      return;
    }

    if (!product || !product.id) {
      console.error('CartContext: Invalid product data:', product);
      return;
    }
    
    // Get or create cartId — use local variable to avoid stale state
    let activeCartId = cartId;
    if (!activeCartId) {
      try {
        const newCart = await createActiveCart(user.email);
        activeCartId = newCart.id;
        setCartId(activeCartId);
      } catch (error) {
        console.error('CartContext: Error creating new cart:', error);
        return;
      }
    }
    
    try {
      const newCart = [...cart];
      const existingItemIndex = newCart.findIndex(
        item => item.id === product.id && item.size === (size || 'default')
      );
      
      if (existingItemIndex >= 0) {
        newCart[existingItemIndex].quantity += quantity;
      } else {
        // Build item and strip undefined/null so Firestore doesn't reject it
        const rawItem = {
          id: product.id,
          name: product.name || product.product_name || '',
          price: Number(product.price || product.mrp || 0),
          discount: Number(product.discount || 0),
          image: product.image || product.imageUrls?.[0] || '',
          category: product.category || '',
          size: size || 'default',
          quantity: quantity || 1,
          color: product.color || 'Default',
          selected: true,
          addedAt: new Date().toISOString(),
          ...(product.discountPrice ? { discountPrice: Number(product.discountPrice) } : {})
        };
        const newItem = Object.fromEntries(
          Object.entries(rawItem).filter(([, v]) => v !== undefined && v !== null)
        );
        newCart.push(newItem);
        setSelectedItems(prev => [...prev, newItem]);
      }
      
      setCart(newCart);
      // Use activeCartId (local var) not cartId (stale state)
      await updateCart(activeCartId, newCart);
      await saveCartHistory(user.email, newCart);
      
      if (navigate) navigate('/cart');
    } catch (error) {
      console.error('CartContext: Error in addToCart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId, navigate) => {
    if (!requireAuth('remove items from cart', navigate)) return;
    
    try {
      // Remove from cart state
      const newCart = cart.filter(item => item.id !== productId);
      setCart(newCart);
      
      // Also remove from selected items
      setSelectedItems(prev => prev.filter(item => item.id !== productId));
      
      // Save to Firestore
      await saveCartToFirestore(newCart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (productId, newQuantity, navigate) => {
    if (!requireAuth('update cart quantity', navigate) || newQuantity < 1) return;

    try {
      // Update in cart state
      const newCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart(newCart);
      
      // Also update in selected items if it exists there
      setSelectedItems(prev => 
        prev.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Save to Firestore
      await saveCartToFirestore(newCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const toggleItemSelection = async (productId) => {
    try {
      // Find if the item is currently selected
      const isCurrentlySelected = selectedItems.some(item => item.id === productId);
      
      if (isCurrentlySelected) {
        // Remove from selected items
        setSelectedItems(prev => prev.filter(item => item.id !== productId));
      } else {
        // Add to selected items
        const itemToAdd = cart.find(item => item.id === productId);
        if (itemToAdd) {
          setSelectedItems(prev => [...prev, itemToAdd]);
        }
      }
    } catch (error) {
      console.error('Error toggling item selection:', error);
    }
  };

  const selectAllItems = () => {
    setSelectedItems([...cart]);
  };

  const unselectAllItems = () => {
    setSelectedItems([]);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discount
        ? Number(item.price || 0) * (1 - Number(item.discount || 0) / 100)
        : Number(item.price || 0);
      return total + price * Number(item.quantity || 1);
    }, 0);
  };

  const getSelectedItemsTotal = () => {
    return selectedItems.reduce((total, item) => {
      const price = item.discount
        ? Number(item.price || 0) * (1 - Number(item.discount || 0) / 100)
        : Number(item.price || 0);
      return total + price * Number(item.quantity || 1);
    }, 0);
  };

  const clearCartItems = async (navigate) => {
    if (!requireAuth('clear cart', navigate)) return;
    
    try {
      // Save current cart items to history before clearing
      await saveCartHistory(currentUser.email, cart);
      
      // Clear state
      setCart([]);
      setSelectedItems([]);
      
      // Clear in Firestore
      if (currentUser?.email && cartId) {
        await clearCart(cartId);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const removeSelectedItems = async () => {
    try {
      // Get IDs of selected items
      const selectedIds = selectedItems.map(item => item.id);
      
      // Filter out selected items from cart
      const newCart = cart.filter(item => !selectedIds.includes(item.id));
      
      // Update state
      setCart(newCart);
      setSelectedItems([]);
      
      // Save to Firestore
      await saveCartToFirestore(newCart);
    } catch (error) {
      console.error('Error removing selected items:', error);
    }
  };

  const value = {
    cart,
    loading,
    selectedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    unselectAllItems,
    getCartCount,
    getCartTotal,
    getSelectedItemsTotal,
    clearCart: clearCartItems,
    removeSelectedItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

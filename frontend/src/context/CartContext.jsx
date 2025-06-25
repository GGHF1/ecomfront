import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedOptions = {}) => {
    setCart((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );
      if (existingItem) {
        return prev.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, selectedOptions, quantity: 1 }];
    });
    
    // automatically open cart when an item is added for QA testing
    setIsCartOpen(true);
  };

  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        newCart.splice(index, 1);
      } else {
        newCart[index] = { ...item, quantity: newQuantity };
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };
  
  // Add toggle function for cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      clearCart,
      isCartOpen,
      setIsCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
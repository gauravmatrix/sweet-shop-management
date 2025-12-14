import { createContext, useContext, useState } from 'react';

const SweetContext = createContext();

export const useSweetContext = () => useContext(SweetContext);

export const SweetProvider = ({ children }) => {
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (sweet, quantity) => {
    setCart(prev => [...prev, { ...sweet, quantity }]);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <SweetContext.Provider value={{
      selectedSweet,
      setSelectedSweet,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }}>
      {children}
    </SweetContext.Provider>
  );
};
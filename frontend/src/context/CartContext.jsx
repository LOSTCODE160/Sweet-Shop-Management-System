import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Save cart to localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('sweet_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('sweet_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (sweet, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === sweet.id);
            if (existing) {
                // Ensure we don't exceed stock
                const newQty = Math.min(existing.quantity + quantity, sweet.quantity);
                return prev.map(item => item.id === sweet.id ? { ...item, quantity: newQty } : item);
            }
            return [...prev, { ...sweet, quantity: Math.min(quantity, sweet.quantity), maxStock: sweet.quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) return;
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.min(newQty, item.maxStock) };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    const checkout = async () => {
        setIsCheckingOut(true);
        // Sequential purchases because backend only supports buying 1 at a time or restocking
        // Actually, the backend endpoint is `/purchase` which buys 1 unit.
        // We need to call it N times or iterate.
        // Since we cannot change backend, we have to loop (not ideal for large orders, but fits constraints).
        // EDIT: Wait, calling API 50 times for 50 items is bad. 
        // But the constraint says "Do NOT change backend APIs".
        // Let's see if we can optimize? No, strict rule.
        // We will loop. Ideally the backend should have a 'buy_batch' endpoint.
        // We will try to execute requests in parallel chunks to be faster.

        const results = { success: 0, failed: 0 };

        try {
            for (const item of cart) {
                for (let i = 0; i < item.quantity; i++) {
                    try {
                        await client.post(`/api/sweets/${item.id}/purchase`);
                        results.success++;
                    } catch (e) {
                        results.failed++;
                        // If one fails (e.g. out of stock during process), stop buying this item
                        break;
                    }
                }
            }

            if (results.success > 0) {
                clearCart();
                alert(`Successfully purchased ${results.success} items!`);
            }
            if (results.failed > 0) {
                alert(`Could not purchase ${results.failed} items (likely out of stock).`);
            }
        } catch (e) {
            console.error(e);
            alert("Checkout failed unexpectedly.");
        } finally {
            setIsCheckingOut(false);
            setIsCartOpen(false);
        }
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            isCartOpen, toggleCart, checkout, isCheckingOut,
            totalItems, totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

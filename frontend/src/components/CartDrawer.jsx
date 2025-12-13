import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getDisplayName } from '../utils/sweetNameMap';

const CartDrawer = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, checkout, isCheckingOut, totalPrice } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'black',
                            zIndex: 90
                        }}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0, right: 0, bottom: 0,
                            width: '100%', maxWidth: '400px',
                            background: 'white',
                            zIndex: 100,
                            boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShoppingBag /> Your Cart
                            </h2>
                            <button onClick={toggleCart} className="btn" style={{ padding: '0.5rem' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
                                    <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Your cart is empty.</p>
                                    <button onClick={toggleCart} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {cart.map(item => (
                                        <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 0.25rem 0' }}>{getDisplayName(item.name)}</h4>
                                                <p style={{ margin: 0, color: '#8b5cf6', fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', borderRadius: '0.5rem', padding: '0.25rem' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="btn"
                                                    style={{ padding: '0.25rem' }}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600', minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="btn"
                                                    style={{ padding: '0.25rem' }}
                                                    disabled={item.quantity >= item.maxStock}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button onClick={() => removeFromCart(item.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={checkout}
                                    disabled={isCheckingOut}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                                >
                                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;

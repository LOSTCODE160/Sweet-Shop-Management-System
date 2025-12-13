import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Edit, Trash2, Plus, Minus } from 'lucide-react';
import { getDisplayName } from '../utils/sweetNameMap';

const SweetCard = ({ sweet, isAdmin, onAddToCart, onRestock, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [restockAmount, setRestockAmount] = useState(50);
    const [editForm, setEditForm] = useState({ name: sweet.name, price: sweet.price, category: sweet.category });
    const [qty, setQty] = useState(1);

    // Variants for animation
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        hover: { y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }
    };

    const handleUpdate = () => {
        onUpdate(sweet.id, editForm);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <motion.div
                className="card"
                style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#64748b' }}>Edit Sweet</h4>
                    <input className="input-field" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                    <input className="input-field" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" />
                    <input className="input-field" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} placeholder="Price" />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdate}>Save</button>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Quantity Badge */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: sweet.quantity > 0 ? '#dcfce7' : '#fee2e2',
                color: sweet.quantity > 0 ? '#15803d' : '#991b1b',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600'
            }}>
                {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
            </div>

            <div>
                {/* Category Pill */}
                <span style={{
                    display: 'inline-block',
                    background: '#f1f5f9',
                    color: '#64748b',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {sweet.category}
                </span>

                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1e293b' }}>
                    {getDisplayName(sweet.name)}
                </h3>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                    ${sweet.price.toFixed(2)}
                </p>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {!isAdmin ? (
                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem' }}>
                            <button className="btn" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} style={{ padding: '0.25rem' }}><Minus size={16} /></button>
                            <span style={{ fontWeight: '600', flex: 1, textAlign: 'center' }}>{qty}</span>
                            <button className="btn" onClick={() => setQty(Math.min(sweet.quantity, qty + 1))} disabled={qty >= sweet.quantity} style={{ padding: '0.25rem' }}><Plus size={16} /></button>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onAddToCart(sweet, qty)}
                            disabled={sweet.quantity <= 0}
                            className="btn btn-primary"
                            style={{ width: '100%', opacity: sweet.quantity <= 0 ? 0.6 : 1 }}
                        >
                            <ShoppingBag size={18} />
                            {sweet.quantity > 0 ? 'Add to Cart' : 'Unavailable'}
                        </motion.button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem' }}>
                            <input
                                type="number"
                                value={restockAmount}
                                onChange={(e) => setRestockAmount(e.target.value)}
                                style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                            />
                            <button
                                onClick={() => onRestock(sweet.id, parseInt(restockAmount))}
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', flex: 1 }}
                            >
                                <Plus size={14} /> Restock
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={{ flex: 1 }}>
                                <Edit size={16} /> Edit
                            </button>
                            <button onClick={() => onDelete(sweet.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default SweetCard;

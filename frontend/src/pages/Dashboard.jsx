import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../context/CartContext'; // Import Cart Hook
import SweetCard from '../components/SweetCard';
import CartDrawer from '../components/CartDrawer'; // Import Drawer
import { Search, LogOut, User, Candy, Filter, PlusCircle, ShoppingCart } from 'lucide-react'; // Added ShoppingCart icon
import { motion } from 'framer-motion';

const Navbar = ({ user, logout }) => {
    const { totalItems, toggleCart } = useCart(); // Use Cart Hook

    return (
        <nav style={{
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: '#8b5cf6', padding: '0.5rem', borderRadius: '0.5rem', color: 'white' }}>
                        <Candy size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Sweet Shop</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <User size={18} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            {user?.name || user?.sub} <span style={{ background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase' }}>{user?.role}</span>
                        </span>
                    </div>

                    {/* Cart Button */}
                    <button onClick={toggleCart} className="btn" style={{ position: 'relative', padding: '0.5rem' }}>
                        <ShoppingCart size={22} color="#475569" />
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '0.7rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700'
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

const Hero = () => (
    <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        padding: '4rem 0',
        color: 'white',
        marginBottom: '3rem',
        borderRadius: '0 0 2rem 2rem',
        boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)'
    }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}
            >
                Treat Yourself Today
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}
            >
                Discover our handcrafted selection of premium chocolates, candies, and delights managed just for you.
            </motion.p>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { addToCart } = useCart(); // Use Cart Hook
    const isAdmin = user?.role === 'ADMIN';

    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Admin Create Form
    const [newSweet, setNewSweet] = useState({ name: '', category: '', price: '', quantity: '' });

    const fetchSweets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.q = search;
            if (categoryFilter) params.category = categoryFilter;

            const endpoint = (search || categoryFilter) ? '/api/sweets/search' : '/api/sweets';
            const res = await client.get(endpoint, { params });
            setSweets(res.data);
        } catch (err) {
            setError(err.response?.status === 401 ? 'Session expired' : 'Failed to fetch sweets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => fetchSweets(), 300);
        return () => clearTimeout(timeout);
    }, [search, categoryFilter]);

    // NOTE: Purchases are now handled by CartContext, but we need to refresh sweets when cart checks out.
    // Ideally CartContext should trigger a refresh or we poll. 
    // For simplicity, we can pass a refresh function to context or just poll occasionally?
    // Let's just poll or rely on manual refresh for now, or better:
    // We can add a "refresh trigger" to the dependency array if we lifted state up, but that's complex.
    // Alternatively, just refresh every few seconds? No.
    // Let's keep it simple: The UI updates optimistically or user refreshes.
    // BUT, the goal is Inventory Update.
    // Let's add a refresh trigger that we can pass to CartProvider? No, CartProvider is higher up.
    // We will just re-fetch sweets when the window gains focus or similar.
    // Actually, let's keep it simple for this iteration.

    const handleRestock = async (id, amount) => {
        try {
            if (isNaN(amount) || amount <= 0) return;
            const res = await client.post(`/api/sweets/${id}/restock`, { amount });
            setSweets(sweets.map(s => s.id === id ? { ...s, quantity: res.data.new_quantity } : s));
        } catch (err) {
            alert("Restock failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this sweet?")) return;
        try {
            await client.delete(`/api/sweets/${id}`);
            setSweets(sweets.filter(s => s.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            const res = await client.put(`/api/sweets/${id}`, data);
            setSweets(sweets.map(s => s.id === id ? res.data : s));
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await client.post('/api/sweets', {
                ...newSweet,
                price: parseFloat(newSweet.price),
                quantity: parseInt(newSweet.quantity)
            });
            setSweets([...sweets, res.data]);
            setIsCreateOpen(false);
            setNewSweet({ name: '', category: '', price: '', quantity: '' });
        } catch (err) {
            alert("Create failed");
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar user={user} logout={logout} />
            <CartDrawer />
            <Hero />

            <div className="container">
                {/* Controls Section */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    alignItems: 'center'
                }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: '3rem' }}
                            placeholder="Search sweets..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div style={{ position: 'relative', minWidth: '180px' }}>
                        <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <select
                            className="input-field"
                            style={{ paddingLeft: '3rem', appearance: 'none' }}
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Chocolate">Chocolate</option>
                            <option value="Candy">Candy</option>
                            <option value="Cake">Cake</option>
                        </select>
                    </div>

                    {isAdmin && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsCreateOpen(!isCreateOpen)}
                        >
                            <PlusCircle size={18} /> Add New
                        </button>
                    )}
                </div>

                {/* Create Form (Admin) */}
                {isAdmin && isCreateOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            marginBottom: '2rem',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Add New Sweet</h3>
                        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <input className="input-field" placeholder="Name" required value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} />
                            <input className="input-field" placeholder="Category" required value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} />
                            <input className="input-field" type="number" placeholder="Price" required value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} />
                            <input className="input-field" type="number" placeholder="Quantity" required value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: e.target.value })} />
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Sweet</button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading delicious sweets...</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {sweets.map(sweet => (
                            <SweetCard
                                key={sweet.id}
                                sweet={sweet}
                                isAdmin={isAdmin}
                                onAddToCart={addToCart} // Pass addToCart
                                onRestock={handleRestock}
                                onDelete={handleDelete}
                                onUpdate={handleUpdate}
                            />
                        ))}
                    </div>
                )}

                {!loading && sweets.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        No sweets found. {isAdmin ? "Why not add some?" : "Check back later!"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

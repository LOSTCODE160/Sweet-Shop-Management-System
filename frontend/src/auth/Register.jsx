import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Candy, ArrowRight, Lock, Mail, User } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/login');
        } catch (err) {
            console.error("Registration Error Object:", err);
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
                setError(detail.map(d => d.msg).join(', '));
            } else if (typeof detail === 'string') {
                setError(detail);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
            padding: '1rem',
            color: '#e2e8f0'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    backdropFilter: 'blur(12px)',
                    padding: '2.5rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    maxWidth: '420px',
                    border: '1px solid rgba(148, 163, 184, 0.1)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        background: '#8b5cf6',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)'
                    }}>
                        <Candy size={24} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: 'white' }}>Create Account</h2>
                    <p style={{ marginTop: '0.5rem', color: '#94a3b8' }}>Join the sweetest community today</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #475569',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = '#475569'}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #475569',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = '#475569'}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Create a strong password"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #475569',
                                    background: 'rgba(15, 23, 42, 0.5)',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                onBlur={(e) => e.target.style.borderColor = '#475569'}
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '0.75rem',
                            border: 'none',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: isLoading ? 'wait' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.4)'
                        }}
                    >
                        {isLoading ? 'Creating Account...' : (
                            <>
                                Register <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Already have an account?
                    <Link
                        to="/login"
                        style={{
                            color: '#c084fc',
                            textDecoration: 'none',
                            fontWeight: '600',
                            marginLeft: '0.5rem'
                        }}
                    >
                        Login here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

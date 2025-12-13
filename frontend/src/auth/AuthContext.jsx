import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry?
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            // Backend expects { "username": "email", "password": "..." }
            const response = await client.post('/auth/token', { username, password });
            const { access_token } = response.data;

            localStorage.setItem('token', access_token);
            setToken(access_token);

            const decoded = jwtDecode(access_token);
            setUser(decoded);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (name, email, password) => {
        try {
            await client.post('/auth/register', { name, email, password });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete client.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

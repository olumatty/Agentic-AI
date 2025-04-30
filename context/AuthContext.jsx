import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to get headers with potential token
    const getHeaders = (isFormData = false) => {
        const headers = {
            'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
        };
        // You might need to adjust how you get your token here
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*)(?:(?!;)|.*))/g, '$1');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    useEffect(() => {
        revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const revalidate = async () => {
        try {
            const storedUserId = localStorage.getItem('userId');
            const storedEmail = localStorage.getItem('email');
            const storedUsername = localStorage.getItem('username');

            if (!storedUserId) {
                setIsLoading(false);
                return;
            }

            const res = await axios.get('https://travelai-server.onrender.com/api/v1/auth/revalidate', { withCredentials: true });

            if (res.status === 200 && res.data.userId === storedUserId) {
                setUser({ id: storedUserId, email: storedEmail, username: storedUsername });
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Revalidate failed:", error.response?.data || error.message);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = ({ userId, email, username }) => {
        setUser({ id: userId, email, username });
        setIsAuthenticated(true);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        localStorage.setItem('username', username);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, revalidate, isLoading, getHeaders }}> 
            {!isLoading && children}
            {isLoading && <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const axiosConfig = {
        withCredentials: true, // needed if your JWT is in a cookie
    };

    useEffect(() => {
        revalidate();
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

            const res = await axios.get('http://localhost:8000/api/v1/auth/revalidate', axiosConfig);

            if (res.status === 200 && res.data.userId === storedUserId) {
                setUser({ id: storedUserId, email: storedEmail, username: storedUsername });
                setIsAuthenticated(true);
            } else {
                logout(); // if it doesn’t match, clear everything
            }
        } catch (error) {
            console.error("Revalidate failed:", error.response?.data || error.message);
            logout(); // logout on failure
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
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, revalidate, isLoading }}>
            {!isLoading && children}
            {isLoading && <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

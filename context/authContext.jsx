import React from 'react'
import {createContext, useState, useContext, useEffect} from 'react'

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUser({id:storedUserId, email: storedUserId});
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userId) => {
        setUser({id:userId,email: userId});
        setIsAuthenticated(true);
        localStorage.setItem('userId', userId);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}
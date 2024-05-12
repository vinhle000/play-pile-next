import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import userService from '@/services/userService';
const UserContext = createContext({});

const API_URL = `${import.meta.env.VITE_REACT_APP_URL}/api/users`;

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await userService.getUserInfo();
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const register = async (username, email, password, confirmPassword) => {
        try {
            const response = await userService.register(username, email, password, confirmPassword);
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error registering user', error);
            throw error;
        }
    }

    const login = async (email, password) =>{

        try {
            const response = await userService.login(email, password);
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error logging in', error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            //NOTE: Dont think we need the response, just need to clear the user
            const response = await userService.logout();
            setUser(null);
        } catch (error) {
            console.error('Error logging out', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

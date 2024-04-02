import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import LogRocket from 'logrocket';


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

                LogRocket.identify('THE_USER_ID_IN_YOUR_APP', {
                    username: response.data.username,
                    email: response.data.email,
                });
            } catch (error) {
                console.error('Error fetching user data', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) =>{

        try {
            const response = await userService.login(email, password);;
            setUser(response.data);
        } catch (error) {
            console.error('Error logging in', error);
        }
    }

    const logout = async () => {
        try {
            //NOTE: Dont think we need the response, just need to clear the user
            const response = await userService.logout();
            setUser(null);
        } catch (error) {
            console.error('Error logging out', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

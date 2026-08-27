import { createContext, useContext, useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../services/auth";


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const register = async (userData) => {
        return registerUser(userData);
    };

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        setUser(data.user);
        
        return data;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
};
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import API_BASE from "../API";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem("faro-user") || null);
    const [userData, setUserData] = useState(() => {
        const stored = localStorage.getItem("faro-user-info");
        return stored ? JSON.parse(stored) : null;
    });

    const handleLogin = (userData, authToken) => {
        localStorage.setItem("faro-user", authToken);
        localStorage.setItem("faro-user-info", JSON.stringify(userData));
        setUser(authToken);
        setUserData(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem("faro-user");
        localStorage.removeItem("faro-user-info");
        setUser(null);
        setUserData(null);
    };

    useEffect(() => {
        if (user) {
            axios
                .get(`${API_BASE}/user/getOne`, {
                    headers: {
                        Authorization: user,
                    },
                })
                .then((response) => {
                    setUserData(response.data);
                    localStorage.setItem("faro-user-info", JSON.stringify(response.data));
                })
                .catch(() => {
                    handleLogout();
                });
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, userData, isLoggedIn: !!user, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for cleaner consumption
export const useAuth = () => useContext(AuthContext);

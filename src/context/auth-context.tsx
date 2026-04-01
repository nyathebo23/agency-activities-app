import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType } from "./types/auth-context-type";
import { getStoredToken, getStoredUser } from "../services/storage-service";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {

    const [user, setUser] = useState(getStoredUser());
    const [token, setToken] = useState(getStoredToken());

    const value: AuthContextType = {
        user,
        token,
        setUser,
        setToken,
        isAuthenticated: !!token
    }
    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export const useAuth: () => AuthContextType = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
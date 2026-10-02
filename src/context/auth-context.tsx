import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType } from "./types/auth-context-type";
import {
    getStoredToken,
    getStoredUser,
    removeAgencyList,
    removeBusDriverList,
    removeBusList,
    removeCurrentAgencyId,
    removePaymentMethodList,
    removeStoredToken,
    removeStoredUser,
} from "../services/storage-service";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {

    const [user, setUser] = useState(getStoredUser());
    const [token, setToken] = useState(getStoredToken());

    const logout = () => {
        removeStoredToken();
        removeStoredUser();
        removeAgencyList();
        removeCurrentAgencyId();
        removeBusList();
        removeBusDriverList();
        removePaymentMethodList();
        setToken(null);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        token,
        setUser,
        setToken,
        isAuthenticated: !!token,
        logout,
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
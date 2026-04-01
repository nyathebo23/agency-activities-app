import { createContext, useContext, useState, type ReactNode } from "react";
import type { TicketContextType } from "./types/ticket-context-type";
import type { Customer } from "../types/models/customer";
import type { Travel } from "../types/models/travel";

const  CustomerTicketContext = createContext<TicketContextType | null>(null);
export const CustomerTicketProvider = ({children}: {children: ReactNode}) => {
    const [travel, setTravel] = useState<Travel | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [travelPrice, setTravelPrice] = useState(3000);

    const value = {
        travel,
        setTravel,
        customers,
        setCustomers,
        travelPrice,
        setTravelPrice
    };
    
    return <CustomerTicketContext.Provider value={value}>
            {children}
        </CustomerTicketContext.Provider>

}

export const useTicketDatas: () => TicketContextType = () => {
    const context = useContext(CustomerTicketContext);
    if (!context) {
        throw new Error("useTicketDatas must be used within CustomerTicketProvider");
    }
    return context;
}
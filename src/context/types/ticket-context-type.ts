import type { Customer } from "../../types/models/customer"
import type { Travel } from "../../types/models/travel"

export type TicketContextType = {
    travel: Travel | null,
    setTravel: React.Dispatch<React.SetStateAction<Travel | null>>,
    customers: Customer[],
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
    travelPrice: number,
    setTravelPrice: React.Dispatch<React.SetStateAction<number>>
}


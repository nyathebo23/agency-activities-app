import type { Customer } from "../../types/models/customer"
import type { Travel } from "../../types/models/travel"
import type { TravelTicket } from "../../types/models/travel-ticket"

export type TicketContextType = {
    currentTravel: Travel | null,
    setCurrentTravel: React.Dispatch<React.SetStateAction<Travel | null>>,
    customers: Customer[],
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>,
    travelPrice: number,
    setTravelPrice: React.Dispatch<React.SetStateAction<number>>,
    ticketCreated: TravelTicket | null,
    setTicketCreated: React.Dispatch<React.SetStateAction<TravelTicket | null>>
}


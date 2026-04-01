import type { TravelType } from "../models/travel";
import type { TicketType } from "../models/travel-ticket";

export type TicketQueryParams = {
    startDateTime?: string;
    endDateTime?: string;
    travelType?: TravelType;
    ticketType?: TicketType;
    paymentMethod?: string;
    refunded?: boolean;
    used?: boolean; 
    pageNumber: number;
    pageSize: number;
}
export type TravelTicket = {
    id: string;
    refNumber: string;
    ticketType: TicketType;
    issuanceDatetime: Date;
    paid: number;
    paymentMethod: string;
    customerId: string;
    customerFullname: string;
    agencyId: string;
    travelId: string;
    used: boolean;
    refund: boolean;
}

export const TicketType = {
    RESERVATION: 0,
    DIRECT: 1
} as const;

export type TicketType = typeof TicketType[keyof typeof TicketType];


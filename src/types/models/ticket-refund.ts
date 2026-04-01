export type TicketRefund = {
    id: string;
    ticketRefNumber: string;
    datetime: Date;
    paid: number;
    paymentMethod: string;
}
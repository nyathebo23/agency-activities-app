import { z } from 'zod';
import { TicketType } from '../models/travel-ticket';

export const travelTicketSchema = z.object({
    ticketType: z.enum(TicketType),
    paid: z.coerce.number<number>().min(0),
    paymentMethodId: z.string(),
    customerId: z.string(),
    travelId: z.string(),
});

export type TravelTicketSchema = z.infer<typeof travelTicketSchema>;
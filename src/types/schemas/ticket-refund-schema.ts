import { z } from 'zod';

export const ticketRefundSchema = z.object({
    ticketId: z.uuidv7(),
    paid: z.number().min(0),
    paymentMethodId: z.uuidv7(),
});

export type TicketRefundSchema = z.infer<typeof ticketRefundSchema>;
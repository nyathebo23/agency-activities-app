import { z } from 'zod';

export const refundUpdateSchema = z.object({
    paid: z.coerce.number<number>().min(0),
    paymentMethodId: z.uuidv7(),
});

export type RefundUpdateSchema = z.infer<typeof refundUpdateSchema>;
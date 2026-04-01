import type { Dayjs } from 'dayjs';
import { z } from 'zod';

export const customerSchema = z.object({
    username: z.string(),
    password: z.string(),
    lastname: z.string().min(1, {error: 'Lastname is required'}),
    firstname: z.string(),
    phoneNumber: z.string().refine(
      (val) => val.replace(/\s/g, '').length == 9, {
        error: 'Invalid phone number'
      }
    ),
    dateBirth: z.custom<Dayjs | null>(
      (val): val is Dayjs => val !== null && val !== undefined,
      { error: 'Date required' }
    )
    // .refine(
    //   (val) val === null || (dayjs.isDayjs(val) && val.isValid,
    //   { message: 'Invalid date' }
    // )
    // .refine(
    //   (val) => val === null || val.isBefore(dayjs(), 'day'),
    //   { message: 'The date should be in past' }
    // ),
});

export type CustomerSchema = z.infer<typeof customerSchema>;

export const customerNamesSchema = customerSchema.pick({
      firstname: true,
      lastname: true
  });
export type CustomerNamesSchema = z.infer<typeof customerNamesSchema>;

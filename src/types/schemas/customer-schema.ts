import type { Dayjs } from 'dayjs';
import { z } from 'zod';

export const customerSchema = z.object({
    username: z.preprocess(
        (val: string) => (val.trim() == '' ? undefined : val),
         z.string().optional()
    ),
    password: z.preprocess(
        (val: string) => (val.trim() == '' ? undefined : val),
         z.string().optional()
    ),
    lastname: z.preprocess(
        (val: string) =>  val.trim(),
        z.string().refine(
          (val) => val.trim().length > 0, { error: 'Lastname is required' }
        )
      ),
    firstname: z.preprocess(
        (val: string) => { const outVal = val.trim(); return outVal == '' ? '' : outVal; },
         z.string().optional()
    ),
    phoneNumber: z.string().optional().refine(
      (val) => !val || val.replace(/\s/g, '').length == 9, {
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

export type CustomerSchemaInput = z.input<typeof customerSchema>;
export type CustomerSchemaOutput = z.output<typeof customerSchema>;

export const customerNamesSchema = customerSchema.pick({
      firstname: true,
      lastname: true
  });
export type CustomerNamesSchema = z.infer<typeof customerNamesSchema>;

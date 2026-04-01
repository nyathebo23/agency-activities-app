import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, 
    InputLabel, LinearProgress, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEntitiesInfos } from "../context/entities-infos-context";
import { useUpdateTicketRefund } from "../services/travel-ticket-service";
import { getErrorMessage } from "../utils/response";
import { refundUpdateSchema, type RefundUpdateSchema } from "../types/schemas/refund-update-schema";
import type { TicketRefund } from "../types/models/ticket-refund";

export const TicketEditFormDialog = ({open, handleClose, refund} : {
        open: boolean, 
        handleClose: () => void, 
        refund: TicketRefund,
    }) => {
    const { 
        register, control, formState: { errors }, reset, handleSubmit } = useForm<RefundUpdateSchema>({ 
        mode: 'all',
        resolver: zodResolver(refundUpdateSchema),
        defaultValues: {
            
        }
    });

    const { paymentMethodList } = useEntitiesInfos();

    const refundEditMutation = useUpdateTicketRefund(refund.id);

    const onSubmit: SubmitHandler<RefundUpdateSchema> = (data) => {
        refundEditMutation.mutate(data, {
            onSuccess: (_) => {
                reset();
                handleClose();
            }
        });
    }

    return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ticket refund edit</DialogTitle>
        <DialogContent>
            <Box             
                component="form" 
                onSubmit={handleSubmit(onSubmit)}>
                {refundEditMutation.isPending && <LinearProgress  sx={{ marginY: 1 }} />}
                {refundEditMutation.isError && <Typography className='form-post-error'>
                        {getErrorMessage(refundEditMutation.error)}
                    </Typography>}

                <FormControl fullWidth>
                    <InputLabel id="payment-method-label">Payment method</InputLabel>
                    <Controller
                        name="paymentMethodId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                labelId="payment-method-label"
                                id="payment-method"
                                label="Payment method"
                                onChange={(e) => field.onChange(e.target.value)}
                            >
                                {
                                    paymentMethodList.map((paymentMethod) => 
                                    (<MenuItem value={paymentMethod.id}>{paymentMethod.name}</MenuItem>))
                                }
                            </Select>
                            )}
                    >
                    </Controller>
                </FormControl>
                
                <TextField 
                    {...register('paid')}
                    label="Paid"
                    variant="outlined"  
                    error={!!errors.paid}
                    helperText={errors.paid?.message}
                />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>

)};
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { ticketRefundSchema, type TicketRefundSchema } from "../types/schemas/ticket-refund-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import type { TravelTicket } from "../types/models/travel-ticket";
import { useEntitiesInfos } from "../context/entities-infos-context";
import { useCreateTicketRefund } from "../services/travel-ticket-service";

export const TicketRefundFormDialog = ({open, handleClose, ticket} : {
        open: boolean, 
        handleClose: () => void, 
        ticket: TravelTicket
    }) => {
    const { 
        register, control, formState: { errors }, reset, handleSubmit } = useForm<TicketRefundSchema>({ 
        mode: 'all',
        resolver: zodResolver(ticketRefundSchema),
        defaultValues: {

        }
    });
    const { paymentMethodList } = useEntitiesInfos();
    const ticketRefundMutation = useCreateTicketRefund();

    const onSubmit: SubmitHandler<TicketRefundSchema> = (data) => {
        ticketRefundMutation.mutate(data, {
            onSuccess: (_) => {
                reset();
                handleClose();
            }
        });
    }

    return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ticket Refund {ticket.refNumber}</DialogTitle>
        <DialogContent>
          <Box             
            component="form" 
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                minWidth: 250,
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 2, 
                p: 3, 
                margin: '0 auto',
            }}
        >
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
            Validate
          </Button>
        </DialogActions>
      </Dialog>

)};
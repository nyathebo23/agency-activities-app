import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { ticketRefundSchema, type TicketRefundSchema } from "../types/schemas/ticket-refund-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
    FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import type { TravelTicket } from "../types/models/travel-ticket";
import { useEntitiesInfos } from "../context/entities-infos-context";
import { useCreateTicketRefund } from "../services/travel-ticket-service";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

export const TicketRefundFormDialog = ({open, handleClose, ticket} : {
        open: boolean, 
        handleClose: () => void, 
        ticket: TravelTicket | null,
    }) => {
    const { 
        register, control, formState: { errors }, handleSubmit } = useForm<TicketRefundSchema>({ 
        mode: 'all',
        resolver: zodResolver(ticketRefundSchema),
        defaultValues: {
            ticketId: ticket?.id,
            paymentMethodId: ticket?.paymentMethodId,
            paid: ticket?.paid
        }
    });
    const { paymentMethodList } = useEntitiesInfos();
    const ticketRefundMutation = useCreateTicketRefund();

    const onSubmit: SubmitHandler<TicketRefundSchema> = (data) => {
        ticketRefundMutation.mutate(data, {
            onSuccess: (_) => {
                setOpenSnackbarSuccess(true);
            }
        });
    }

    const [ openSnackbarSuccess, setOpenSnackbarSuccess ] = useState(false);

    const handleCloseSnackbarSuccess = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }   
        setOpenSnackbarSuccess(false);
    };

    const SnackbarAction = (handleClose: () => void) => (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                Close
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );


    return (
    <Dialog color="primary" open={open} onClose={handleClose}>
        <DialogTitle>Ticket Refund {ticket?.refNumber}</DialogTitle>
        <DialogContent dividers>
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
                            value={field.value}
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
          <Button onClick={handleSubmit(onSubmit)} type="submit">
            Validate
          </Button>
        </DialogActions>
        <Snackbar
            open={openSnackbarSuccess}
            autoHideDuration={2000}
            onClose={handleCloseSnackbarSuccess}
            message={`Ticket refunded successfully`}
            action={SnackbarAction(handleCloseSnackbarSuccess)}
        />
      </Dialog>

)};
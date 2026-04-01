import { Box, Button, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, 
    Select, Snackbar, Stack, TextField, Typography, type SnackbarCloseReason } from '@mui/material';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { travelTicketSchema, type TravelTicketSchema } from '../types/schemas/travel-ticket-schema';
import { useCreateTicket } from '../services/travel-ticket-service';
import { getErrorMessage } from '../utils/response';
import { TicketType } from '../types/models/travel-ticket';
import { useTicketDatas } from '../context/customer-ticket-context';
import { useEntitiesInfos } from '../context/entities-infos-context';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { toTravelString } from '../utils/travel_functions';

export const TicketCreateForm = ({ backStep }: { backStep: () => void }) => {
    const { customers, travel, travelPrice } = useTicketDatas();
    const { paymentMethodList } = useEntitiesInfos();

    const { register, control, formState: { errors }, handleSubmit } = useForm<TravelTicketSchema>({ 
        mode: 'all',
        resolver: zodResolver(travelTicketSchema),
        defaultValues: {
            travelId: travel!.id,
            customerId: customers[0].id,
            ticketType: TicketType.DIRECT,
            paymentMethodId: paymentMethodList[0].id,
            paid: travelPrice
        }
    });

    const ticketCreateMutation = useCreateTicket();
    const onSubmit: SubmitHandler<TravelTicketSchema> = (data) => {
        if (travel)
            data.travelId = travel.id;
            //setValue('travelId', travel.id)
        ticketCreateMutation.mutate(data);
    }
    
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const handleCloseSnackbar = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpenSuccessSnackbar(false);
    };

    const snackbarAction = (
        <React.Fragment>
        <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            Close
        </Button>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
        </React.Fragment>
    );
    console.log(toTravelString(travel!), customers, paymentMethodList, travelPrice);

    return (
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
            }}>
                <Typography variant='h4' sx={{textAlign: 'center'}}>
                    Ticket creation
                </Typography>
                {travel && <Typography variant='h6' sx={{textAlign: 'center'}}>
                    {toTravelString(travel)}
                </Typography>}
                
                {ticketCreateMutation.isPending && <LinearProgress  sx={{ marginY: 1 }} />}
                {ticketCreateMutation.isError && <Typography className='form-post-error'>
                        {getErrorMessage(ticketCreateMutation.error)}
                    </Typography>}
                <FormControl fullWidth>
                    <InputLabel id="ticket-type-label">Ticket type</InputLabel>
                    <Controller
                        name="ticketType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                labelId="ticket-type-label"
                                id="ticket-type"
                                label="Ticket type"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            >
                                <MenuItem value={TicketType.DIRECT}>DIRECT</MenuItem>
                                <MenuItem value={TicketType.RESERVATION}>RESERVATION</MenuItem>
                            </Select>
                        )}
                    >
                    </Controller>
                </FormControl>
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
                <FormControl fullWidth>
                    <InputLabel id="customer-label">Customer</InputLabel>
                    <Controller
                        name="customerId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                labelId="customer-label"
                                id="customer"
                                label="Customer"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                            >
                                {
                                    customers.map((customer) => 
                                    (<MenuItem value={customer.id}>
                                        {customer.user.lastname + " " + customer.user.firstname + ", " + customer.dateBirth.toLocaleDateString()}
                                    </MenuItem>))
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
                <Stack spacing={2} direction="row">
                    <Button 
                        variant="outlined"
                        onClick={backStep}
                    >
                        Back
                    </Button>
                    <Button 
                        type='submit' 
                        variant="contained" 
                        loading={ticketCreateMutation.isPending}
                        loadingPosition='start'
                    > 
                        Create 
                    </Button>
                </Stack>
            <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Travel ticket created successfully"
                action={snackbarAction}
            />
        </Box>
    );
    
}
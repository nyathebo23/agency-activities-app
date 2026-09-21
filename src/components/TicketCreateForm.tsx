import { Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, 
    Select, Stack, Typography } from '@mui/material';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { travelTicketSchema, type TravelTicketSchema } from '../types/schemas/travel-ticket-schema';
import { useCreateTicket } from '../services/travel-ticket-service';
import { getErrorMessage } from '../utils/response';
import { TicketType, type TravelTicket } from '../types/models/travel-ticket';
import { useTicketDatas } from '../context/customer-ticket-context';
import { useEntitiesInfos } from '../context/entities-infos-context';
import { toTravelString } from '../utils/travel_functions';
import { useQueryClient } from '@tanstack/react-query';

export const TicketCreateForm = ({ backStep, nextStep }: { backStep: () => void; nextStep: () => void }) => {
    const { customers, currentTravel, setTicketCreated } = useTicketDatas();
    const { paymentMethodList } = useEntitiesInfos();

    const { control, handleSubmit } = useForm<TravelTicketSchema>({ 
        mode: 'all',
        resolver: zodResolver(travelTicketSchema),
        defaultValues: {
            travelId: currentTravel!.id,
            customerId: customers[0].id,
            ticketType: TicketType.DIRECT,
            paymentMethodId: paymentMethodList[0].id,
        }
    });
    const queryClient = useQueryClient();
    const ticketCreateMutation = useCreateTicket();
    const onSubmit: SubmitHandler<TravelTicketSchema> = async (data) => {
        if (currentTravel)
            data.travelId = currentTravel.id;
        ticketCreateMutation.mutate(data, {
            onSuccess: async (data: TravelTicket) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['tickets-of-travel']}),
                queryClient.invalidateQueries({ queryKey: ['agency-tickets']})
            ]);           
            setTicketCreated(data);  
            nextStep();    
            console.log("ticket created", data);
        }});       
    }

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
                {currentTravel && <Typography variant='h6' sx={{textAlign: 'center'}}>
                    {toTravelString(currentTravel)}
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
        </Box>
    );
    
}
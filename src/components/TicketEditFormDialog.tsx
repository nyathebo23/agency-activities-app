import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { TicketType, type TravelTicket } from "../types/models/travel-ticket";
import { useEntitiesInfos } from "../context/entities-infos-context";
import { travelTicketSchema, type TravelTicketSchema } from "../types/schemas/travel-ticket-schema";
import type { TravelQueryParams } from "../types/query-params/travel-query-params";
import { useState } from "react";
import { useFutureTravels } from "../services/travel-service";
import { toTravelString } from "../utils/travel_functions";
import { useUpdateTicket } from "../services/travel-ticket-service";
import { getErrorMessage } from "../utils/response";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export const TicketEditFormDialog = ({open, handleClose, ticket} : {
        open: boolean, 
        handleClose: () => void, 
        ticket: TravelTicket,
    }) => {
    const { 
        register, control, formState: { errors }, reset, handleSubmit } = useForm<TravelTicketSchema>({ 
        mode: 'all',
        resolver: zodResolver(travelTicketSchema),
        defaultValues: {
            
        }
    });
    const [page, setPage] = useState(0);
    const { paymentMethodList } = useEntitiesInfos();

    const travelsQueryParams: TravelQueryParams = {
            pageNumber: page,
            pageSize: 25,
    };
    const travelsQuery = useFutureTravels(travelsQueryParams);
    const ticketEditMutation = useUpdateTicket(ticket.id);

    const onSubmit: SubmitHandler<TravelTicketSchema> = (data) => {
        ticketEditMutation.mutate(data, {
            onSuccess: (_) => {
                reset();
                handleClose();
            }
        });
    }

    return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ticket edit</DialogTitle>
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
                {ticketEditMutation.isPending && <LinearProgress  sx={{ marginY: 1 }} />}
                {ticketEditMutation.isError && <Typography className='form-post-error'>
                        {getErrorMessage(ticketEditMutation.error)}
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
                    <InputLabel id="travel-label">Travel</InputLabel>
                    <Controller
                        name="travelId"
                        control={control}
                        render={({ field }) => (
                            <Stack gap={1} direction={'row'}>
                                <Select
                                    labelId="travel-label"
                                    id="travel"
                                    label="Travel"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                >
                                    {travelsQuery?.data?.items.map(travel => (
                                    <MenuItem value={travel.id}>{toTravelString(travel)}</MenuItem>
                                    ))}
                                </Select>
                                <IconButton 
                                    disabled={page === 0} 
                                    onClick={() => setPage(page-1)}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                                <IconButton 
                                    disabled={!travelsQuery.data?.hasNextPage} 
                                    onClick={() => setPage(page+1)}
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            </Stack>

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
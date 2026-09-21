import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { customerSchema, type CustomerSchemaOutput, type CustomerSchemaInput } from "../types/schemas/customer-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, IconButton, Snackbar, Stack, TextField, Typography, type SnackbarCloseReason } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCreateCustomer, useCustomersQueryList } from "../services/customer-service";
import { useTicketDatas } from "../context/customer-ticket-context";
import React, { useEffect, useState } from "react";
import type { CustomerQueryParams } from "../types/query-params/customer-query-params";
import { getErrorMessage } from "../utils/response";
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";

export const CustomerForm = ({ nextStep }: { nextStep: () => void } ) => {
    const { 
        register, control, formState: { errors, isSubmitting }, 
        getValues, trigger, reset, handleSubmit } = useForm<CustomerSchemaInput, any, CustomerSchemaOutput>({ 
        mode: 'all',
        resolver: zodResolver(customerSchema),
    });
    const [customerQueryParams, setCustomerQueryParams ] = useState<CustomerQueryParams | null> (null);
    const customerCreateMutation = useCreateCustomer();
    const customersQuery = useCustomersQueryList(customerQueryParams);
    const { currentTravel } = useTicketDatas();
    const [ openSnackbarErr, setOpenSnackbarErr ] = useState(false);
    const [ snackbarErr, setSnackbarErr ] = useState('');

    const onCreate: SubmitHandler<CustomerSchemaOutput> = async (data) => {
        if (!currentTravel) {
            setSnackbarErr('Please select a travel before in the table');
            setOpenSnackbarErr(true);
            return;
        }        

        customerCreateMutation.mutate(data, {
            onSuccess: (data) => {
                setCustomers([data]);
                setOpenSuccessSnackbar(true);
                reset();
                nextStep();
            }
        });
    }
    const { setCustomers } = useTicketDatas();
    const onQueryCustomers  = async () => {
        const isValid = await trigger(['firstname', 'lastname']);
        if (!isValid) {
            setSnackbarErr('Error in lastname or firstname');
            setOpenSnackbarErr(true);
            return;
        }
        if (!currentTravel) {
            setSnackbarErr('Please select a travel before in the table');
            setOpenSnackbarErr(true);
            return;
        }               
        const data = getValues();
        setCustomerQueryParams({
            lastname: data.lastname,
            firstname: data.firstname,
        });        
    }

    useEffect(() => {
        if (customersQuery.data) {
            if (customersQuery.data.length > 0) {
                setCustomers(customersQuery.data);
                nextStep()
            }
            else {
                setSnackbarErr('No user found with lastname and firstname parts you entered');
                setOpenSnackbarErr(true);
            }
        }
    }, [customersQuery.isSuccess])
    
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
    return (
        <Box 
           component="form" 
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
            <Typography variant='h5' sx={{marginBottom: 2, marginTop: 1, textAlign: 'center'}}>
                Customer create
            </Typography>
                {customersQuery.isError && <Typography className='form-post-error'>
                     {getErrorMessage(customersQuery.error)}
            </Typography>}
                {customerCreateMutation.isError && <Typography className='form-post-error'>
                     {getErrorMessage(customerCreateMutation.error)}
            </Typography>}
            <TextField 
                {...register('lastname')} 
                label="Lastname" 
                variant="outlined"
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
            />
            <TextField 
                {...register('firstname')}
                label="Firstname" 
                variant="outlined"  
                error={!!errors.firstname}
                helperText={errors.firstname?.message}
            />
            <TextField 
                {...register('username')} 
                label="Username" 
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username?.message}
            />
            <TextField 
                {...register('password')}
                label="Password" 
                variant="outlined"  
                type='password'
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <TextField
                        value={value || ''}
                        onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length > 9) v = v.slice(0, 9);
                            let formatted = '';
                            for (let i = 0; i < v.length; i++) {
                                if ((i-1) % 2 === 0) formatted += ' ';
                                formatted += v[i];
                            }                            
                            onChange(formatted);
                        }}
                        label="Phone number"
                        fullWidth
                        type="tel"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                    />
                )}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <Controller
                    name="dateBirth"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                    <DatePicker
                        label="Date of birth"
                        value={value || null}
                        onChange={(newValue) => {
                            onChange(newValue); // ← transmet Dayjs | null directement
                        }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                error: !!errors.dateBirth,
                                helperText: errors.dateBirth?.message,
                            },
                        }}
                        disableFuture
                        maxDate={dayjs().subtract(6, 'month')}
                        minDate={dayjs().subtract(130, 'year')}
                    />
                    )}
                />
            </LocalizationProvider>
            <Stack spacing={2} direction="column">
                <Button 
                    variant="outlined"
                    onClick={onQueryCustomers}
                    disabled={isSubmitting}
                    loading={!!customerQueryParams && customersQuery?.isPending}
                    loadingPosition="start"
                >
                    Get corresponding users
                </Button>
                <Button 
                    variant="contained"
                    onClick={handleSubmit(onCreate)}
                    loading={customerCreateMutation.isPending}
                    loadingPosition="start"
                    disabled={isSubmitting}
                >
                    Create
                </Button>
            </Stack>
            <Snackbar
                open={openSuccessSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Customer created successfully"
                action={snackbarAction}
            />
            <Snackbar
                open={openSnackbarErr}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbarErr(false)}
                message={snackbarErr}
            />
        </Box>
    )
}
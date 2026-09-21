import { useTicketDatas } from "../context/customer-ticket-context";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, IconButton, Snackbar, Stack,  Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDeleteTicket } from "../services/travel-ticket-service";
import React, { useState } from "react";
import { toTravelString } from "../utils/travel_functions";
import CloseIcon from '@mui/icons-material/Close';
import { useEntitiesInfos } from "../context/entities-infos-context";

export const ConfirmTicketCreation = ({ backStep, resetStep }: { backStep: () => void; resetStep: () => void }) => {

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };
    const [ openSnackbarSuccess, setOpenSnackbarSuccess ] = useState(false);
    const [ openSnackbarErr, setOpenSnackbarErr ] = useState(false);
    const handleCloseSnackbarSuccess = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }   
        setOpenSnackbarSuccess(false);
    };
    const handleCloseSnackbarErr = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }   
        setOpenSnackbarErr(false);
    };
    const { paymentMethodStringMap } = useEntitiesInfos();
    const { ticketCreated, currentTravel } = useTicketDatas();
    const deleteTicketMutation = useDeleteTicket(ticketCreated ? ticketCreated.id: '');
    const handleDelete = () => {
        deleteTicketMutation.mutate(undefined, {
            onSuccess: () => {
                setOpenSnackbarSuccess(true);
                backStep();
            },
            onError: (error) => {
                console.error("Error deleting ticket:", error);
                setOpenSnackbarErr(true);
            }
        });
    }
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
    return <>
        {ticketCreated &&
            (<Box
                sx={{
                    padding: 3,
                    textAlign: "center",
                    marginBottom: 2,
                }}
            >
                <CheckCircleIcon
                    sx={{
                        fontSize: 60,      
                        color: "#2ecc71",  
                        mb: 1,
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: "#2e7d32",
                        mb: 1,
                    }}
                >
                    Success
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: "#4f4f4f",
                    }}
                >
                    Ticket created sucessfully for {ticketCreated.customerFullname} to 
                    {toTravelString(currentTravel!)} with {paymentMethodStringMap.get(ticketCreated.paymentMethodId)} payment method. 
                    You can delete the ticket if you made a mistake somewhere
                </Typography>
            </Box>)}
            <Stack gap={2} direction={'row'} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button 
                    variant='contained'
                    color='warning'
                    loading={deleteTicketMutation.isPending}
                    onClick={() => setOpenDeleteDialog(true)}
                >
                    DELETE TICKET
                </Button>
                    
                <Button 
                    variant="outlined"
                    onClick={resetStep}
                >
                    Reset
                </Button>
            </Stack>
            <Dialog
                open={openDeleteDialog}
                maxWidth="xs"
                onClose={handleCloseDeleteDialog}
                color="warning"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle color="warning" id="alert-dialog-title">
                    Delete {ticketCreated?.customerFullname} ticket 
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the ticket with ref {ticketCreated?.refNumber} of {ticketCreated?.customerFullname}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button 
                        variant='contained' 
                        color='warning' 
                        onClick={handleDelete} 
                        loading={deleteTicketMutation.isPending}
                        autoFocus
                        >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbarSuccess}
                autoHideDuration={2000}
                onClose={handleCloseSnackbarSuccess}
                message={`Ticket with ref ${ticketCreated?.refNumber} deleted successfully `}
                action={SnackbarAction(handleCloseSnackbarSuccess)}
            />
            <Snackbar
                open={openSnackbarErr}
                autoHideDuration={2000}
                onClose={handleCloseSnackbarErr}
                message={"An error occurred while deleting the ticket"}
                action={SnackbarAction(handleCloseSnackbarErr)}
            />
        </>        
}

import { Paper, Table, TableContainer, TableHead, TableRow, 
    TableBody, TableCell,  styled, tableCellClasses, 
    Typography,
    Stack,
    IconButton} from "@mui/material";
import { useTicketsOfTravel } from "../services/travel-ticket-service";
import { useTicketDatas } from "../context/customer-ticket-context";
import dayjs from "dayjs";
import { travelTypes } from "../types/models/travel";
import EditIcon from '@mui/icons-material/Edit';
import MoneyIcon from '@mui/icons-material/Money';
import { useState } from "react";
import { TicketEditFormDialog } from "./TicketEditFormDialog";
import { TicketRefundFormDialog } from "./TicketRefundFormDialog";
import type { TravelTicket } from "../types/models/travel-ticket";

const ticketTypes = ['RESERVATION', 'DIRECT'];

export const TravelTicketsList = () => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },}
    ));

    const  displayedColumns = ['Ref number', 'Fullname', 'Ticket type', 'Issuance datetime', 'Payment method', 'Options'];

    const { travel } = useTicketDatas();

    const travelTicketsQuery = useTicketsOfTravel(travel == null ? null : travel.id);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openRefundDialog, setOpenRefundDialog] = useState(false);

    const [ticketToEdit, setTicketToEdit] = useState<TravelTicket>();
    const [ticketToRefund, setTicketToRefund] = useState<TravelTicket>();


    return !!travel && (<TableContainer component={Paper}>
        <Typography variant='h5' sx={{textAlign: 'center', marginY: 2}}>
            {`Tickets list of travel ${travelTypes[travel.travelType]} 
        depart planned to ${dayjs(travel.plannedDepartDatetime).format('YYYY-MM-DD HH:mm')}`}
        </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
                {displayedColumns.map((column) => (
                    <StyledTableCell key={column} align="right">
                        {column}
                    </StyledTableCell>
                ))}
          </TableRow>
        </TableHead>
        <TableBody>
            {travelTicketsQuery?.data?.map((ticket) => (
            <TableRow key={ticket.id}>
                <TableCell align="right">{ticket.refNumber}</TableCell>
                <TableCell align="right">{ticket.customerFullname}</TableCell>
                <TableCell align="right">{ticketTypes[ticket.ticketType]}</TableCell>
                <TableCell align="right">
                    {dayjs(ticket.issuanceDatetime).format('YYYY-MM-DD HH:mm')}
                </TableCell>
                <TableCell align="right">{ticket.paymentMethod}</TableCell>
                <TableCell align="right"> 
                    <Stack gap={1} direction={'row'}>
                        <IconButton aria-label="select" size="small" 
                            onClick={() => {
                                setTicketToEdit(ticket);
                                setOpenEditDialog(true);
                            }}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton aria-label="select" size="small" 
                            onClick={() => {
                                setTicketToRefund(ticket);
                                setOpenRefundDialog(true);
                            }}>
                            <MoneyIcon/>
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
      {!!ticketToEdit && <TicketEditFormDialog 
        open={openEditDialog} 
        handleClose={() => setOpenEditDialog(false)}
        ticket={ticketToEdit}>

      </TicketEditFormDialog>}
      {!!ticketToRefund && <TicketRefundFormDialog
        open={openRefundDialog}
        handleClose={() => setOpenRefundDialog(false)}
        ticket={ticketToRefund}>

      </TicketRefundFormDialog>}
    </TableContainer>)
    
}
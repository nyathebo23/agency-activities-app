import { Paper, Table, TableContainer, TableHead, TableRow, 
    TableBody, TableCell,  styled, tableCellClasses, 
    Typography,
    Stack,
    IconButton,
    Checkbox} from "@mui/material";
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
import { useEntitiesInfos } from "../context/entities-infos-context";

const ticketTypes = ['RESERVATION', 'DIRECT'];

export const TravelTicketsList = () => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },}
    ));

    const  displayedColumns = ['Ref number', 'Fullname', 'Ticket type', 'Issuance datetime', 'Payment method', 'Refunded', 'Options'];

    const { currentTravel } = useTicketDatas();
    const { paymentMethodStringMap } = useEntitiesInfos();
    const travelTicketsQuery = useTicketsOfTravel(currentTravel == null ? null : currentTravel.id);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openRefundDialog, setOpenRefundDialog] = useState(false);

    const [ticketToEdit, setTicketToEdit] = useState<TravelTicket | null>(null);
    const [ticketToRefund, setTicketToRefund] = useState<TravelTicket | null>(null);

    const handleEditTicket = (ticket: TravelTicket) => {
        setTicketToEdit(ticket);
        setOpenEditDialog(true);
    }

    const handleRefundTicket = (ticket: TravelTicket) => {
        setTicketToRefund(ticket);
        setOpenRefundDialog(true);
    }

    return !!currentTravel && (<TableContainer sx={{ maxHeight: 500 }} component={Paper}>
        <Typography variant='h5' sx={{textAlign: 'center', marginY: 2}}>
            {`Tickets list of travel ${travelTypes[currentTravel.travelType]} 
        depart planned to ${dayjs(currentTravel.plannedDepartDatetime).format('YYYY-MM-DD HH:mm')}`}
        </Typography>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
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
                <TableCell align="right">{paymentMethodStringMap.get(ticket.paymentMethodId)}</TableCell>
                <TableCell align="right">
                    <Checkbox  disabled checked={ticket.refunded} />
                </TableCell>
                <TableCell align="right"> 
                    {!ticket.used && !ticket.refunded && <Stack gap={1} direction={'row'}>
                        <IconButton aria-label="select" size="small" 
                            onClick={() => handleEditTicket(ticket)}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton aria-label="select" size="small" 
                            onClick={() => handleRefundTicket(ticket)}>
                            <MoneyIcon/>
                        </IconButton>
                    </Stack>}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
      </Table>
      <TicketEditFormDialog 
        open={openEditDialog} 
        handleClose={() => setOpenEditDialog(false)}
        ticket={ticketToEdit}>
      </TicketEditFormDialog>

      <TicketRefundFormDialog
        open={openRefundDialog}
        handleClose={() => setOpenRefundDialog(false)}
        ticket={ticketToRefund}>
      </TicketRefundFormDialog>
    </TableContainer>)
    
}
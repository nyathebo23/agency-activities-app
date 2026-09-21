import { Paper, Table, TableContainer, TableHead, TableRow, 
    TableBody, TableCell,  styled, tableCellClasses, 
    Button,
    Stack,
    Select,
    MenuItem,
    type SelectChangeEvent,
    TablePagination,
    FormControlLabel,
    Checkbox,
    Switch,
    InputLabel,
    FormControl,
    IconButton
    } from "@mui/material";
import { useAgencyTickets } from "../services/travel-ticket-service";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';
import MoneyIcon from '@mui/icons-material/Money';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { TravelType } from "../types/models/travel";
import { TicketType, type TravelTicket } from "../types/models/travel-ticket";
import type { TicketQueryParams } from "../types/query-params/ticket-query-params";
import { useEntitiesInfos } from "../context/entities-infos-context";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TicketEditFormDialog } from "../components/TicketEditFormDialog";
import { TicketRefundFormDialog } from "../components/TicketRefundFormDialog";


const ticketTypes = ['RESERVATION', 'DIRECT'];

export const TicketListPage = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [travelType, setTravelType] = useState<TravelType | undefined>();
    const [ticketType, setTicketType] = useState<TicketType | undefined>();
    const [paymentMethodId, setPaymentMethodId] = useState<string | undefined>();
    const [ticketsUsed, setTicketsUsed] = useState<boolean | undefined>();
    const [ticketsRefunded, setTicketsRefunded] = useState<boolean | undefined>();
    const [ticketsUsedEnabled, setTicketsUsedEnabled] = useState<boolean>(false);
    const [ticketsRefundedEnabled, setTicketsRefundedEnabled] = useState<boolean>(false);

    const [startDateTime, setStartDateTime] = useState<PickerValue>(null);
    const [endDateTime, setEndDateTime] = useState<PickerValue>(null);  

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openRefundDialog, setOpenRefundDialog] = useState(false);

    const [ticketToEdit, setTicketToEdit] = useState<TravelTicket>();
    const [ticketToRefund, setTicketToRefund] = useState<TravelTicket>();

    const { currentAgencyId, paymentMethodStringMap } = useEntitiesInfos();
    const [ticketsQueryParams, setTicketsQueryParams] = useState<TicketQueryParams>({
        pageNumber: page,
        pageSize: rowsPerPage,
    });

    const ticketsQuery = useAgencyTickets(ticketsQueryParams, currentAgencyId);
    
    const handleChangePage = (_: unknown, newPage: number) => {
        console.log(newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const { paymentMethodList } = useEntitiesInfos();

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },}
    ));

    const  displayedColumns = ['Ref number', 'Fullname', 'Ticket type', 'Issuance datetime', 
        'Payment method', 'Used', 'Refunded', 'Options'];

    const getTicketsOfAgency = () => {
        const ticketQueryParams: TicketQueryParams = {
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
            pageNumber: page,
            pageSize: rowsPerPage,
            travelType: travelType,
            ticketType: ticketType,
            paymentMethod: paymentMethodId,
            used: ticketsUsedEnabled ? ticketsUsed : undefined,
            refunded: ticketsRefundedEnabled ? ticketsRefunded : undefined
        }
        setTicketsQueryParams(ticketQueryParams);
    }

    useEffect(() => {
        getTicketsOfAgency();
    }, [page, rowsPerPage]);

    return (
    <Stack gap={2}>
        <Stack direction={'row'} gap={2} sx={{ flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    value={startDateTime}
                    onChange={(newValue) => setStartDateTime(newValue)}
                    label="Start datetime"
                />
                <DateTimePicker
                    value={endDateTime}
                    onChange={(newValue) => setEndDateTime(newValue)}
                    label="End datetime"
                />
            </LocalizationProvider>
            <FormControl sx={{ width: 200 }}>
                <InputLabel id="travel-type-label">Travel type</InputLabel>
                <Select
                    labelId="travel-type-label"
                    id="travel-type"
                    label="Travel type"
                    onChange={(event: SelectChangeEvent<TravelType | undefined>) => {
                        setTravelType(event.target.value as TravelType | undefined);
                    }}
                >
                    <MenuItem value={undefined}>ALL</MenuItem>
                    <MenuItem value={TravelType.CLASSIC}>CLASSIC</MenuItem>
                    <MenuItem value={TravelType.VIP}>VIP</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ width: 200 }}>
                <InputLabel id="ticket-type-label">Ticket type</InputLabel>
                <Select
                    labelId="ticket-type-label"
                    id="ticket-type"
                    label="Ticket type"
                    onChange={(event: SelectChangeEvent<TicketType | undefined>) => {
                        setTicketType(event.target.value as TicketType | undefined);
                    }}
                >
                    <MenuItem value={undefined}>ALL</MenuItem>
                    <MenuItem value={TicketType.RESERVATION}>RESERVATION</MenuItem>
                    <MenuItem value={TicketType.DIRECT}>DIRECT</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ width: 200 }}>
                <InputLabel id="payment-method-label">Payment method</InputLabel>
                <Select
                    labelId="payment-method-label"
                    id="payment-method" 
                    label="Payment method"
                    onChange={(event: SelectChangeEvent<string | undefined>) => {
                        setPaymentMethodId(event.target.value as string | undefined);
                    }}            
                >
                    <MenuItem value={undefined}> ALL </MenuItem>
                    {
                        paymentMethodList.map((paymentMethod) => 
                        (<MenuItem value={paymentMethod.id}>{paymentMethod.name}</MenuItem>))
                    }
                </Select>
            </FormControl>

            <Stack direction={'row'} sx={{display: 'flex', alignItems: 'center'}} gap={0.5}>
                <Switch
                    checked={ticketsUsedEnabled}
                    onChange={() => setTicketsUsedEnabled(!ticketsUsedEnabled)}
                    color="primary"
                />
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={ticketsUsed} 
                            disabled={!ticketsUsedEnabled} 
                            onChange={() => setTicketsUsed(!ticketsUsed)} 
                        />
                    }
                    label="Tickets used"
                />
            </Stack>

            <Stack direction={'row'}  sx={{display: 'flex', alignItems: 'center'}} gap={0.5}>
                <Switch
                    checked={ticketsRefundedEnabled}
                    onChange={() => setTicketsRefundedEnabled(!ticketsRefundedEnabled)}
                    color="primary"
                />
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={ticketsRefunded} 
                            disabled={!ticketsRefundedEnabled} 
                            onChange={() => setTicketsRefunded(!ticketsRefunded)} 
                        />
                    }
                    label="Tickets refunded"
                />
            </Stack>

            <Button 
                variant="contained" 
                loading={ticketsQuery.isLoading} 
                loadingPosition="start"
                onClick={() => getTicketsOfAgency()}
            >
                Validate
            </Button>           
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>            
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="simple table">
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
                        {ticketsQuery.data?.items.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell align="right">{ticket.refNumber}</TableCell>
                            <TableCell align="right">{ticket.customerFullname}</TableCell>
                            <TableCell align="right">{ticketTypes[ticket.ticketType]}</TableCell>
                            <TableCell align="right">
                                {dayjs(ticket.issuanceDatetime).format('YYYY-MM-DD HH:mm')}
                            </TableCell>
                            <TableCell align="right">{paymentMethodStringMap.get(ticket.paymentMethodId)}</TableCell>
                            <TableCell align="right">
                                <Checkbox  disabled checked={ticket.used} />
                            </TableCell>
                            <TableCell align="right">
                                <Checkbox  disabled checked={ticket.refunded} />
                            </TableCell>
                            <TableCell align="right"> 
                                {!ticket.used && !ticket.refunded && <Stack gap={1} direction={'row'} >
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
                                </Stack>}
                            </TableCell>

                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {ticketsQuery.data && ticketsQuery.data?.totalPages > 1 && <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={ticketsQuery?.data?.totalCount ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />}
        </Paper>
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
    </Stack>
  );
}
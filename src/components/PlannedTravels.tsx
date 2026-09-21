import { Paper, Table, TableContainer, TableHead, TablePagination, TableRow, 
    TableBody, TableCell, Stack, styled, tableCellClasses, Button, Select, MenuItem, type SelectChangeEvent, 
    FormControl,
    InputLabel,
    IconButton
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFutureTravels } from "../services/travel-service";
import { travelStates, TravelType, travelTypes, type Travel } from "../types/models/travel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import type { TravelQueryParams } from "../types/query-params/travel-query-params";
import dayjs from "dayjs";
import { useTicketDatas } from "../context/customer-ticket-context";
import { useEntitiesInfos } from "../context/entities-infos-context";
import type { PickerValue } from "@mui/x-date-pickers/internals";

export const PlannedTravels = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [travelType, setTravelType] = useState<TravelType | undefined>();
    const [startDateTime, setStartDateTime] = useState<PickerValue>(null);
    const [endDateTime, setEndDateTime] = useState<PickerValue>(null);

    const [travelsQueryParams, setTravelsQueryParams] = useState<TravelQueryParams>({
            pageNumber: page,
            pageSize: rowsPerPage,
    });
    const travelsQuery = useFutureTravels(travelsQueryParams);

    const { agencyStringMap } = useEntitiesInfos();

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const { currentTravel, setCurrentTravel } = useTicketDatas();

    const selectTravel = (travel: Travel) => {
        setCurrentTravel(travel);
    }
    const getTravels = () => {
        const travelQueryParams: TravelQueryParams = {
            startDateTime: startDateTime?.toISOString(),
            endDateTime: endDateTime?.toISOString(),
            pageNumber: page,
            pageSize: rowsPerPage,
            travelType: travelType
        };
        setTravelsQueryParams(travelQueryParams);
    }

    const  displayedColumns = ['Arrival Agency', 'Travel type', 'Travel state',
        'Planned depart datetime', 'Select'];

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
            },
    }));
    
    useEffect(() => {
        getTravels();
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
            <Button 
                variant="contained" 
                loading={travelsQuery.isLoading} 
                loadingPosition="start"
                onClick={() => getTravels()}
            >
                Validate
            </Button>           
        </Stack>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
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
                    {travelsQuery?.data?.items.map(travel => (
                        <TableRow key={travel.id}>
                            <StyledTableCell align="right">{agencyStringMap.get(travel.arrivalAgencyId)}</StyledTableCell>
                            <StyledTableCell align="right">{travelTypes[travel.travelType]}</StyledTableCell>
                            <StyledTableCell align="right">{travelStates[travel.travelState]}</StyledTableCell>
                            <StyledTableCell align="right">
                                {dayjs(travel.plannedDepartDatetime).format('YYYY-MM-DD HH:mm')}
                            </StyledTableCell>
                            <StyledTableCell align="right"> 
                                <IconButton aria-label="select" size="small" onClick={() => selectTravel(travel)}>
                                    <SelectAllIcon color={travel.id === currentTravel?.id ? "info" : "inherit"}/>
                                </IconButton>
                            </StyledTableCell>
                        </TableRow>
                    ))}
                    
                </TableBody>
                </Table>
            </TableContainer>
            {travelsQuery.data && travelsQuery.data?.totalPages > 1 && <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={travelsQuery.data?.totalCount ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />}
        </Paper>

    </Stack>
    
  );
}
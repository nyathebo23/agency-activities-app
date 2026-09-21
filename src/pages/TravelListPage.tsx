import { Paper, Table, TableContainer, TableHead, TablePagination, TableRow, 
    TableBody, TableCell, Stack, styled, tableCellClasses, Button, Select, MenuItem, type SelectChangeEvent, 
    FormControl,
    InputLabel,
    ToggleButton,
    ToggleButtonGroup} from "@mui/material";
import { useEffect, useState } from "react";
import { useFutureTravels, useOnGoingOrPastTravels } from "../services/travel-service";
import { TravelType } from "../types/models/travel";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { TravelQueryParams } from "../types/query-params/travel-query-params";
import dayjs from "dayjs";
import { useEntitiesInfos } from "../context/entities-infos-context";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const travelTypes = ['CLASSIC', 'VIP'];
const travelStates = ['Planned', 'Loading', 'Ongoing', 'End'];
const TravelStatus = {
    ONGOING_PAST: 0,
    FUTURE: 1
} as const;
type TravelStatus = typeof TravelStatus[keyof typeof TravelStatus];
export const TravelListPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [travelType, setTravelType] = useState<TravelType | undefined>();

  const [startDateTime, setStartDateTime] = useState<PickerValue>(null);
  const [endDateTime, setEndDateTime] = useState<PickerValue>(null);
  const [travelStatus, setTravelStatus] = useState<TravelStatus>(TravelStatus.ONGOING_PAST); 
  const [travelsQueryParams, setTravelsQueryParams] = useState<TravelQueryParams>({
        startDateTime: startDateTime?.toISOString(),
        endDateTime: endDateTime?.toISOString(),
        pageNumber: page,
        pageSize: rowsPerPage,
        travelType: travelType
  });

  const travelsQuery = travelStatus === TravelStatus.FUTURE ? useFutureTravels(travelsQueryParams) 
  : useOnGoingOrPastTravels(travelsQueryParams);

  const handleChangeTravelsStatus = (
    _: React.MouseEvent<HTMLElement>,
    status: TravelStatus,
  ) => {
    setTravelStatus(status);
  };

  const { agencyStringMap, busDriverStringMap, busStringMap } = useEntitiesInfos();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getTravels = () => {
    const travelQueryParams: TravelQueryParams = {
        startDateTime: startDateTime?.toISOString(),
        endDateTime: endDateTime?.toISOString(),
        pageNumber: page,
        pageSize: rowsPerPage,
        travelType: travelType
    }
    setTravelsQueryParams(travelQueryParams);
  }

  const  displayedColumns = ['Arrival Agency', 'Bus', 'Bus driver', 'Planned depart datetime',
     'Effective depart datetime', 'Arrival datetime', 'Travel type', 'Travel state', 'Options'];

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
            <ToggleButtonGroup
                color="primary"
                value={travelStatus}
                exclusive
                onChange={handleChangeTravelsStatus}
                aria-label="Platform"
            >
                <ToggleButton value={TravelStatus.ONGOING_PAST}>Ongoing or past</ToggleButton>
                <ToggleButton value={TravelStatus.FUTURE}>Future</ToggleButton>
            </ToggleButtonGroup>
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
                        {travelsQuery.data?.items.map(travel => (
                            <TableRow key={travel.id}>
                                <StyledTableCell align="right">{agencyStringMap.get(travel.arrivalAgencyId)}</StyledTableCell>
                                <StyledTableCell align="right">{busStringMap.get(travel.busId)}</StyledTableCell>
                                <StyledTableCell align="right">{busDriverStringMap.get(travel.busDriverId)}</StyledTableCell>
                                <StyledTableCell align="right">
                                    {dayjs(travel.plannedDepartDatetime).format('YYYY-MM-DD HH:mm')}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {travel.effectiveDepartDatetime && dayjs(travel.effectiveDepartDatetime).format('YYYY-MM-DD HH:mm')}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {travel.arrivalDatetime && dayjs(travel.arrivalDatetime).format('YYYY-MM-DD HH:mm')}
                                </StyledTableCell>
                                <StyledTableCell align="right">{travelTypes[travel.travelType]}</StyledTableCell>
                                <StyledTableCell align="right">{travelStates[travel.travelState]}</StyledTableCell>
                                <StyledTableCell align="right"> 
                
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
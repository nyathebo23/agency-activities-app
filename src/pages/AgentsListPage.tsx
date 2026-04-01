import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAgencyAgentsList } from "../services/entities-datas-service"

export const AgentsListPage = () => {
    const agencyAgentsQuery = useAgencyAgentsList();
    const  displayedColumns = ['Username', 'Firstname', 'Lastname', 'Role'];
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
            },
    }));
    return (
        <TableContainer component={Paper}>
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
                {agencyAgentsQuery.data?.map((row) => (
                    <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <StyledTableCell align="right">{row.user.username}</StyledTableCell>

                        <StyledTableCell align="right">{row.user.firstname}</StyledTableCell>
                        <StyledTableCell align="right">{row.user.lastname}</StyledTableCell>
                        <StyledTableCell align="right">{row.user.role}</StyledTableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
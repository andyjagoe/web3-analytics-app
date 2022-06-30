import { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'

const QueryResults = ({headings, rows}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };  
      
    return (
        <>
        {rows.length !== 0?
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 220 }}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="results table">
              <TableHead>
                <TableRow>
                  {headings.map((heading) => (
                    <TableCell key={heading["Name"]}>{heading["Name"]}</TableCell>
                  ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .slice(1).map((row, rowIndex) => (
                  <TableRow
                    key={`${rowIndex}`}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  {(row["Data"]).map((cell, cellIndex) => (                
                    <TableCell key={`${rowIndex}-${cellIndex}`} align="right">
                      {cell["VarCharValue"]}
                    </TableCell>
                  ))}            
                  </TableRow>
                ))}            
              </TableBody>
            </Table>
          </TableContainer> 
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Paper>
          :
          <></>
        }
        </>
    )
}

export default QueryResults;  
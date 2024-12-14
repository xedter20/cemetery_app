import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid2, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";

export default function BasicTable({
  rows = [],
  columns = [],
  onPageChange = null,
  page = 1,
  count = 0,
}) {
  return (
    <Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((item) => {
                return (
                  <TableCell sx={{ fontWeight: "800" }}>{item.title}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow>
                  {columns.map((col, index) => {
                    return (
                      <TableCell
                        key={`${row.name}-${index}`}
                        component="th"
                        scope="row"
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {count > 0 && (
        <Grid2 container justifyContent={"end"}>
          <Box padding={2}>
            <Pagination page={page} count={count} onChange={onPageChange} />
          </Box>
        </Grid2>
      )}
    </Stack>
  );
}

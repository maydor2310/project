import React, { useEffect, useState } from "react"; // comment: react + hooks
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from "@mui/material"; // comment: MUI table
import { STORAGE_KEY, UserRow } from "./UserForm"; // comment: import storage key + type

const loadRows = (): UserRow[] => { // comment: read rows helper
  try { // comment: protect from errors
    const raw = localStorage.getItem(STORAGE_KEY); // comment: read storage
    if (!raw) return []; // comment: empty -> none
    const parsed = JSON.parse(raw); // comment: parse json
    if (!Array.isArray(parsed)) return []; // comment: validate
    return parsed as UserRow[]; // comment: return
  } catch { // comment: error
    return []; // comment: fallback
  } // comment: end try/catch
}; // comment: end loadRows

const UsersTable: React.FC = () => { // comment: table component
  const [rows, setRows] = useState<UserRow[]>([]); // comment: rows state

  const refresh = (): void => { // comment: refresh from storage
    setRows(loadRows()); // comment: set state from storage
  }; // comment: end refresh

  const clear = (): void => { // comment: clear storage
    localStorage.removeItem(STORAGE_KEY); // comment: remove key
    refresh(); // comment: refresh UI
  }; // comment: end clear

  useEffect(() => { // comment: initial load
    refresh(); // comment: load once
  }, []); // comment: run once

  return ( // comment: render
    <Box sx={{ p: 2 }}> {/* comment: wrapper */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}> {/* comment: top row */}
        <Typography variant="h5">Users Table</Typography> {/* comment: title */}
        <Stack direction="row" spacing={1}> {/* comment: buttons row */}
          <Button variant="outlined" onClick={refresh}>Refresh</Button> {/* comment: refresh button */}
          <Button variant="outlined" color="error" onClick={clear}>Clear</Button> {/* comment: clear button */}
        </Stack>
      </Stack>

      <TableContainer component={Paper}> {/* comment: table paper */}
        <Table> {/* comment: table */}
          <TableHead> {/* comment: header */}
            <TableRow> {/* comment: header row */}
              <TableCell>Full Name</TableCell> {/* comment: column */}
              <TableCell>Email</TableCell> {/* comment: column */}
              <TableCell>Phone</TableCell> {/* comment: column */}
              <TableCell>Age</TableCell> {/* comment: column */}
              <TableCell>City</TableCell> {/* comment: column */}
              <TableCell>Created</TableCell> {/* comment: column */}
            </TableRow>
          </TableHead>

          <TableBody> {/* comment: body */}
            {rows.length === 0 ? ( // comment: empty state
              <TableRow> {/* comment: empty row */}
                <TableCell colSpan={6} align="center"> {/* comment: cell span */}
                  No data in localStorage yet. Fill the form first.
                </TableCell>
              </TableRow>
            ) : ( // comment: render rows
              rows.map((r) => ( // comment: map rows
                <TableRow key={r.id}> {/* comment: row */}
                  <TableCell>{r.fullName}</TableCell> {/* comment: cell */}
                  <TableCell>{r.email}</TableCell> {/* comment: cell */}
                  <TableCell>{r.phone}</TableCell> {/* comment: cell */}
                  <TableCell>{r.age}</TableCell> {/* comment: cell */}
                  <TableCell>{r.city}</TableCell> {/* comment: cell */}
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell> {/* comment: date */}
                </TableRow>
              )) // comment: end map
            )} {/* comment: end conditional */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box> // comment: end wrapper
  ); // comment: end return
}; // comment: end component

export default UsersTable; // comment: export

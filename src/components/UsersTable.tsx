import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAppUsers, removeAppUser, type AppUser } from "../services/userService";

const UsersTable: React.FC = () => {
  const [rows, setRows] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAppUsers();
      setRows(data);
    } catch {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onDelete = async (id: string): Promise<void> => {
    const ok = window.confirm("Delete this user record?");
    if (!ok) return;

    setIsWorking(true);
    setError(null);
    try {
      await removeAppUser(id);
      await refresh();
    } catch {
      setError("Failed to delete user");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {(isLoading || isWorking) ? <LinearProgress sx={{ mb: 2 }} /> : null}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Users Table</Typography>
        <Button variant="outlined" onClick={() => void refresh()} disabled={isLoading || isWorking}>
          Refresh
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.fullName}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.phone}</TableCell>
                  <TableCell>{r.age}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => void onDelete(r.id!)}
                      disabled={isLoading || isWorking}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;

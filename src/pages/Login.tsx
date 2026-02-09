import React, { useState } from "react";
import { Alert, Box, Button, LinearProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    const e = email.trim();
    if (!e) return "Email is required";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    if (!ok) return "Email format is invalid";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : "Login failed. Check email/password.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Paper sx={{ p: 3, width: "100%", maxWidth: 420 }} component="form" onSubmit={onSubmit}>
        {isSubmitting ? <LinearProgress sx={{ mb: 2 }} /> : null}

        <Typography variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Stack spacing={2}>
          <TextField
            label="Email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            fullWidth
            disabled={isSubmitting}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            fullWidth
            disabled={isSubmitting}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;

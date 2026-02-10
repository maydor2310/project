import React, { useMemo, useState } from "react";
import { Alert, Box, Button, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { createAppUserWithAuth } from "../services/userService";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  password: string;
  confirmPassword: string;
};

type ErrorsState = Partial<Record<keyof FormState, string>>;

const createEmptyForm = (): FormState => ({
  fullName: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  password: "",
  confirmPassword: "",
});

const validate = (form: FormState): ErrorsState => {
  const errors: ErrorsState = {};

  const name = form.fullName.trim();
  if (!name) errors.fullName = "שם מלא הוא שדה חובה";
  else if (name.length < 2) errors.fullName = "שם מלא חייב להכיל לפחות 2 תווים";
  else if (name.length > 40) errors.fullName = "שם מלא עד 40 תווים";

  const email = form.email.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email) errors.email = "אימייל הוא שדה חובה";
  else if (!emailOk) errors.email = "פורמט אימייל לא תקין";

  const phone = form.phone.trim();
  const phoneOk = /^[0-9]{9,10}$/.test(phone);
  if (!phone) errors.phone = "טלפון הוא שדה חובה";
  else if (!phoneOk) errors.phone = "טלפון חייב להכיל 9–10 ספרות";

  const ageStr = form.age.trim();
  const ageNum = Number(ageStr);
  const ageOk = ageStr !== "" && Number.isFinite(ageNum) && ageNum >= 12 && ageNum <= 120;
  if (!ageStr) errors.age = "גיל הוא שדה חובה";
  else if (!ageOk) errors.age = "הגיל חייב להיות בין 12 ל-120";

  const city = form.city.trim();
  if (!city) errors.city = "עיר היא שדה חובה";
  else if (city.length > 30) errors.city = "עיר עד 30 תווים";

  if (!form.password) errors.password = "סיסמה היא שדה חובה";
  else if (form.password.length < 6) errors.password = "סיסמה חייבת להיות לפחות 6 תווים";

  if (!form.confirmPassword) errors.confirmPassword = "אימות סיסמה הוא שדה חובה";
  else if (form.confirmPassword !== form.password) errors.confirmPassword = "הסיסמאות לא תואמות";

  return errors;
};

type Props = {
  onSaved?: () => void;
};

const UserForm: React.FC<Props> = ({ onSaved }) => {
  const [form, setForm] = useState<FormState>(() => createEmptyForm());
  const [errors, setErrors] = useState<ErrorsState>({});
  const [submitTried, setSubmitTried] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitTried(true);
    setError(null);

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await createAppUserWithAuth({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        age: form.age.trim(),
        city: form.city.trim(),
        password: form.password,
      });

      setForm(createEmptyForm());
      setErrors({});
      setSubmitTried(false);
      if (onSaved) onSaved();
    } catch (err: unknown) {
      const msg = (err as any)?.code || (err as any)?.message || "Failed to create user";
      setError(String(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = (field: keyof FormState): boolean => {
    return Boolean(errors[field]) && submitTried;
  };

  const helper = (field: keyof FormState, fallback: string): string => {
    return submitTried && errors[field] ? String(errors[field]) : fallback;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      {isSubmitting ? <LinearProgress sx={{ mb: 2 }} /> : null}

      <Typography variant="h5" sx={{ mb: 2 }}>
        הוספת משתמש
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Stack spacing={2}>
        <TextField
          name="fullName"
          label="שם מלא"
          value={form.fullName}
          onChange={handleChange}
          error={showError("fullName")}
          helperText={helper("fullName", "2–40 תווים")}
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          name="email"
          label="אימייל"
          value={form.email}
          onChange={handleChange}
          error={showError("email")}
          helperText={helper("email", "name@example.com")}
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          name="phone"
          label="טלפון"
          value={form.phone}
          onChange={handleChange}
          error={showError("phone")}
          helperText={helper("phone", "9–10 ספרות")}
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          name="age"
          label="גיל"
          value={form.age}
          onChange={handleChange}
          error={showError("age")}
          helperText={helper("age", "12–120")}
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          name="city"
          label="עיר"
          value={form.city}
          onChange={handleChange}
          error={showError("city")}
          helperText={helper("city", "עד 30 תווים")}
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          name="password"
          label="סיסמה"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={showError("password")}
          helperText={helper("password", "לפחות 6 תווים")}
          fullWidth
          disabled={isSubmitting}
        />

        <TextField
          name="confirmPassword"
          label="אימות סיסמה"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={showError("confirmPassword")}
          helperText={helper("confirmPassword", "חייב להתאים לסיסמה")}
          fullWidth
          disabled={isSubmitting}
        />

        <Button type="submit" variant="contained" disabled={!isValid || isSubmitting}>
          שמור משתמש
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm;

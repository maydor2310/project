import React, { useMemo, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  createdAt: number;
};

export const STORAGE_KEY = "forms_users_v1";

type FormState = Omit<UserRow, "id" | "createdAt">;
type ErrorsState = Partial<Record<keyof FormState, string>>;

const createEmptyForm = (): FormState => ({
  fullName: "",
  email: "",
  phone: "",
  age: "",
  city: "",
});

const loadRows = (): UserRow[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserRow[]) : [];
  } catch {
    return [];
  }
};

const saveRows = (rows: UserRow[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
};

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

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

  return errors;
};

type Props = {
  onSaved?: () => void;
};

const UserForm: React.FC<Props> = ({ onSaved }) => {
  const [form, setForm] = useState<FormState>(() => createEmptyForm());
  const [errors, setErrors] = useState<ErrorsState>({});
  const [submitTried, setSubmitTried] = useState<boolean>(false);

  const isValid = useMemo(() => Object.keys(validate(form)).length === 0, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitTried(true);

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const rows = loadRows();
    const newRow: UserRow = {
      id: createId(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      age: form.age.trim(),
      city: form.city.trim(),
      createdAt: Date.now(),
    };

    const updated = [newRow, ...rows];
    saveRows(updated);
    setForm(createEmptyForm());
    setErrors({});
    setSubmitTried(false);
    if (onSaved) onSaved();
  };

  const showError = (field: keyof FormState): boolean => {
    return Boolean(errors[field]) && submitTried;
  };

  const helper = (field: keyof FormState, fallback: string): string => {
    return submitTried && errors[field] ? String(errors[field]) : fallback;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        הוספת משתמש
      </Typography>

      <Stack spacing={2}>
        <TextField
          name="fullName"
          label="שם מלא"
          value={form.fullName}
          onChange={handleChange}
          error={showError("fullName")}
          helperText={helper("fullName", "2–40 תווים")}
          fullWidth
        />

        <TextField
          name="email"
          label="אימייל"
          value={form.email}
          onChange={handleChange}
          error={showError("email")}
          helperText={helper("email", "name@example.com")}
          fullWidth
        />

        <TextField
          name="phone"
          label="טלפון"
          value={form.phone}
          onChange={handleChange}
          error={showError("phone")}
          helperText={helper("phone", "9–10 ספרות")}
          fullWidth
        />

        <TextField
          name="age"
          label="גיל"
          value={form.age}
          onChange={handleChange}
          error={showError("age")}
          helperText={helper("age", "12–120")}
          fullWidth
        />

        <TextField
          name="city"
          label="עיר"
          value={form.city}
          onChange={handleChange}
          error={showError("city")}
          helperText={helper("city", "עד 30 תווים")}
          fullWidth
        />

        <Button type="submit" variant="contained" disabled={!isValid}>
          שמור משתמש
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm;
// REVIEW: included for peer review

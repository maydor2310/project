import React, { useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import { COURSES_KEY, TEACHERS_KEY } from "../constants/storageKeys";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Course = {
  id: string;
  code: string;
  name: string;
};

type Teacher = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  courseIds: string[];
  createdAt: number;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  courseIds: string[];
};

type ErrorsState = Partial<Record<keyof FormState, string>>;

const createId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const loadList = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const saveList = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const createEmptyForm = (): FormState => ({
  fullName: "",
  email: "",
  phone: "",
  expertise: "",
  courseIds: [],
});

const validate = (form: FormState): ErrorsState => {
  const errors: ErrorsState = {};

  const name = form.fullName.trim();
  if (!name) errors.fullName = "שם מלא הוא שדה חובה";
  else if (name.length < 2) errors.fullName = "שם מלא חייב להכיל לפחות 2 תווים";
  else if (name.length > 50) errors.fullName = "שם מלא עד 50 תווים";

  const email = form.email.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email) errors.email = "אימייל הוא שדה חובה";
  else if (!emailOk) errors.email = "פורמט אימייל לא תקין";

  const phone = form.phone.trim();
  const phoneOk = /^[0-9]{9,10}$/.test(phone);
  if (!phone) errors.phone = "טלפון הוא שדה חובה";
  else if (!phoneOk) errors.phone = "טלפון חייב להכיל 9–10 ספרות";

  const expertise = form.expertise.trim();
  if (!expertise) errors.expertise = "תחום התמחות הוא שדה חובה";
  else if (expertise.length > 40) errors.expertise = "תחום התמחות עד 40 תווים";

  if (!form.courseIds || form.courseIds.length === 0) {
    errors.courseIds = "יש לבחור לפחות קורס אחד";
  }

  return errors;
};

const Teachers: React.FC = () => {
  // loading states (simulated for localStorage operations)
  const [isLoading, setIsLoading] = useState<boolean>(false); // comment: page load indicator
  const [actionLoading, setActionLoading] = useState<boolean>(false); // comment: submit indicator
  const [loadError, setLoadError] = useState<string | null>(null); // comment: error text

  const [courses] = useState<Course[]>(() => {
    setIsLoading(true); // comment: start loading
    try {
      return loadList<Course>(COURSES_KEY); // comment: load courses
    } catch {
      return []; // comment: fallback
    } finally {
      setIsLoading(false); // comment: end loading
    }
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    setIsLoading(true); // comment: start loading
    try {
      return loadList<Teacher>(TEACHERS_KEY); // comment: load teachers
    } catch {
      return []; // comment: fallback
    } finally {
      setIsLoading(false); // comment: end loading
    }
  });

  const [form, setForm] = useState<FormState>(() => createEmptyForm());
  const [errors, setErrors] = useState<ErrorsState>({});

  const courseLabelById = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => map.set(c.id, `${c.code} - ${c.name}`));
    return map;
  }, [courses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCoursesChange = (value: string[]): void => {
    setForm((prev) => ({ ...prev, courseIds: value }));
    setErrors((prev) => ({ ...prev, courseIds: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoadError(null); // comment: clear error

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setActionLoading(true); // comment: start submit loading
    try {
      const newTeacher: Teacher = {
        id: createId(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        expertise: form.expertise.trim(),
        courseIds: form.courseIds,
        createdAt: Date.now(),
      };

      const updated = [newTeacher, ...teachers];
      setTeachers(updated);
      saveList(TEACHERS_KEY, updated);

      setForm(createEmptyForm());
      setErrors({});
    } catch {
      setLoadError("שמירה נכשלה. נסה שוב.");
    } finally {
      setActionLoading(false); // comment: end submit loading
    }
  };

  return (
    <PageLayout title="ניהול מרצים">
      {(isLoading || actionLoading) && <LinearProgress sx={{ mb: 2 }} />}

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          הוספת מרצה
        </Typography>

        <Stack spacing={2}>
          <TextField
            name="fullName"
            label="שם מלא"
            value={form.fullName}
            onChange={handleChange}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName || "2–50 תווים"}
            fullWidth
            disabled={actionLoading}
          />

          <TextField
            name="email"
            label="אימייל"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email || "name@example.com"}
            fullWidth
            disabled={actionLoading}
          />

          <TextField
            name="phone"
            label="טלפון"
            value={form.phone}
            onChange={handleChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone || "9–10 ספרות"}
            fullWidth
            disabled={actionLoading}
          />

          <TextField
            name="expertise"
            label="תחום התמחות"
            value={form.expertise}
            onChange={handleChange}
            error={Boolean(errors.expertise)}
            helperText={errors.expertise || "עד 40 תווים"}
            fullWidth
            disabled={actionLoading}
          />

          <FormControl fullWidth error={Boolean(errors.courseIds)} disabled={actionLoading}>
            <InputLabel id="courses-select-label">שיוך לקורסים</InputLabel>
            <Select
              labelId="courses-select-label"
              multiple
              label="שיוך לקורסים"
              value={form.courseIds}
              onChange={(e) => handleCoursesChange(e.target.value as string[])}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => courseLabelById.get(id) || "Unknown")
                  .join(", ")
              }
              disabled={courses.length === 0 || actionLoading}
            >
              {courses.length === 0 ? (
                <MenuItem disabled value="">
                  אין קורסים (הוסף קורסים קודם)
                </MenuItem>
              ) : (
                courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))
              )}
            </Select>

            <Typography
              variant="caption"
              color={errors.courseIds ? "error" : "text.secondary"}
              sx={{ mt: 0.5 }}
            >
              {errors.courseIds || "בחר לפחות קורס אחד"}
            </Typography>
          </FormControl>

          <Button type="submit" variant="contained" disabled={courses.length === 0 || actionLoading}>
            שמור מרצה
          </Button>
        </Stack>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        רשימת מרצים ({teachers.length})
      </Typography>

      {teachers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          אין מרצים כרגע.
        </Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            {teachers.map((t) => (
              <Box key={t.id} sx={{ borderBottom: "1px solid #eee", pb: 1 }}>
                <Typography fontWeight={600}>{t.fullName}</Typography>
                <Typography variant="body2">
                  {t.email} | {t.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  התמחות: {t.expertise}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  קורסים:{" "}
                  {t.courseIds.map((id) => courseLabelById.get(id) || "Unknown").join(", ")}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </PageLayout>
  );
};

export default Teachers;

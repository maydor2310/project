import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import type { Course } from "../models/course";
import type { Teacher } from "../models/teacher";
import { getCourses } from "../services/courseService";
import { createTeacher, getTeachers, removeTeacher } from "../services/teacherService";
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

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  expertise: string;
  courseIds: string[];
};

type ErrorsState = Partial<Record<keyof FormState, string>>;

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [form, setForm] = useState<FormState>(() => createEmptyForm());
  const [errors, setErrors] = useState<ErrorsState>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const courseLabelById = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => map.set(c.id!, `${c.code} - ${c.name}`));
    return map;
  }, [courses]);

  const loadAll = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const [c, t] = await Promise.all([getCourses(), getTeachers()]);
      setCourses(c);
      setTeachers(t);
    } catch {
      setError("טעינת נתונים נכשלה");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

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
    setError(null);

    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsWorking(true);
    try {
      await createTeacher({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        expertise: form.expertise.trim(),
        courseIds: form.courseIds,
        createdAt: Date.now(),
      });

      setForm(createEmptyForm());
      setErrors({});
      await loadAll();
    } catch {
      setError("שמירה נכשלה");
    } finally {
      setIsWorking(false);
    }
  };

  const onDelete = async (id: string): Promise<void> => {
    const ok = window.confirm("למחוק את המרצה?");
    if (!ok) return;

    setIsWorking(true);
    setError(null);
    try {
      await removeTeacher(id);
      await loadAll();
    } catch {
      setError("מחיקה נכשלה");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <PageLayout title="ניהול מרצים">
      {(isLoading || isWorking) ? <LinearProgress sx={{ mb: 2 }} /> : null}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

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
            disabled={isWorking}
          />

          <TextField
            name="email"
            label="אימייל"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email || "name@example.com"}
            fullWidth
            disabled={isWorking}
          />

          <TextField
            name="phone"
            label="טלפון"
            value={form.phone}
            onChange={handleChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone || "9–10 ספרות"}
            fullWidth
            disabled={isWorking}
          />

          <TextField
            name="expertise"
            label="תחום התמחות"
            value={form.expertise}
            onChange={handleChange}
            error={Boolean(errors.expertise)}
            helperText={errors.expertise || "עד 40 תווים"}
            fullWidth
            disabled={isWorking}
          />

          <FormControl fullWidth error={Boolean(errors.courseIds)} disabled={isWorking}>
            <InputLabel id="courses-select-label">שיוך לקורסים</InputLabel>
            <Select
              labelId="courses-select-label"
              multiple
              label="שיוך לקורסים"
              value={form.courseIds}
              onChange={(e) => handleCoursesChange(e.target.value as string[])}
              renderValue={(selected) =>
                (selected as string[])
                  .map((cid) => courseLabelById.get(cid) || "Unknown")
                  .join(", ")
              }
              disabled={courses.length === 0 || isWorking}
            >
              {courses.length === 0 ? (
                <MenuItem disabled value="">
                  אין קורסים (הוסף קורסים קודם)
                </MenuItem>
              ) : (
                courses.map((c) => (
                  <MenuItem key={c.id} value={c.id!}>
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

          <Button type="submit" variant="contained" disabled={courses.length === 0 || isWorking}>
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
                  קורסים: {t.courseIds.map((cid) => courseLabelById.get(cid) || "Unknown").join(", ")}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => void onDelete(t.id)}
                    disabled={isWorking}
                  >
                    מחיקה
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </PageLayout>
  );
};

export default Teachers;

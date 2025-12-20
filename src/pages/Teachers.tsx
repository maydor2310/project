import React, { useEffect, useMemo, useState } from "react"; // comment: react hooks
import PageLayout from "../components/PageLayout"; // comment: layout
import { TEACHERS_KEY, COURSES_KEY } from "../constants/storageKeys"; // comment: keys
import type { Teacher } from "../models/teacher"; // comment: teacher type
import type { Course } from "../models/course"; // comment: course type

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material"; // comment: MUI

import EditIcon from "@mui/icons-material/Edit"; // comment: edit icon
import AddIcon from "@mui/icons-material/Add"; // comment: add icon

// ===== helpers =====

const loadTeachers = (): Teacher[] => {
  try {
    const raw = localStorage.getItem(TEACHERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveTeachers = (teachers: Teacher[]): void => {
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
};

const loadCourses = (): Course[] => {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const genId = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random()}`;

// ===== component =====

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadTeachers());
  const [courses] = useState<Course[]>(() => loadCourses());

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [courseIds, setCourseIds] = useState<string[]>([]);

  useEffect(() => {
    saveTeachers(teachers);
  }, [teachers]);

  const openAdd = () => {
    setEditingId(null);
    setFullName("");
    setEmail("");
    setCourseIds([]);
    setOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditingId(t.id);
    setFullName(t.fullName);
    setEmail(t.email);
    setCourseIds(t.courseIds);
    setOpen(true);
  };

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) return;

    if (!editingId) {
      setTeachers((prev) => [
        {
          id: genId(),
          fullName: fullName.trim(),
          email: email.trim(),
          courseIds,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    } else {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, fullName, email, courseIds }
            : t
        )
      );
    }
    setOpen(false);
  };

  const toggleCourse = (id: string) => {
    setCourseIds((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    );
  };

  return (
    <PageLayout title="Teachers Management">
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Total teachers: {teachers.length}
        </Typography>

        <Button startIcon={<AddIcon />} variant="contained" onClick={openAdd}>
          Add Teacher
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teachers.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.fullName}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell>
                  {t.courseIds
                    .map(
                      (id) => courses.find((c) => c.id === id)?.code
                    )
                    .join(", ")}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(t)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== Dialog ===== */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editingId ? "Edit Teacher" : "Add Teacher"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <Box>
              <Typography variant="subtitle2">
                Assign Courses
              </Typography>

              {courses.map((c) => (
                <FormControlLabel
                  key={c.id}
                  control={
                    <Checkbox
                      checked={courseIds.includes(c.id)}
                      onChange={() => toggleCourse(c.id)}
                    />
                  }
                  label={`${c.code} – ${c.name}`}
                />
              ))}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default Teachers;

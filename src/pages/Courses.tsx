import React, { useEffect, useMemo, useState } from "react"; // comment: react hooks
import PageLayout from "../components/PageLayout"; // comment: layout wrapper
import type { Course } from "../models/course"; // comment: course type
import {
  getCourses,
  createCourse,
  updateCourse,
  removeCourse,
} from "../services/courseService"; // comment: firestore service

import {
  Alert, // comment: error message
  Box, // comment: layout box
  Button, // comment: button
  Card, // comment: card
  CardContent, // comment: card content
  Dialog, // comment: dialog
  DialogActions, // comment: dialog actions
  DialogContent, // comment: dialog content
  DialogTitle, // comment: dialog title
  IconButton, // comment: icon button
  LinearProgress, // comment: loading indicator
  Paper, // comment: paper
  Stack, // comment: stack
  Table, // comment: table
  TableBody, // comment: table body
  TableCell, // comment: table cell
  TableContainer, // comment: table container
  TableHead, // comment: table head
  TableRow, // comment: table row
  TextField, // comment: input
  Typography, // comment: typography
} from "@mui/material"; // comment: MUI

import AddIcon from "@mui/icons-material/Add"; // comment: add icon
import EditIcon from "@mui/icons-material/Edit"; // comment: edit icon
import DeleteIcon from "@mui/icons-material/Delete"; // comment: delete icon

/* ---------- Types ---------- */

type CourseFormState = {
  code: string;
  name: string;
  credits: string;
  teacherName: string;
};

type CourseFormErrors = Partial<Record<keyof CourseFormState, string>>;

/* ---------- Helpers ---------- */

const emptyForm = (): CourseFormState => ({
  code: "",
  name: "",
  credits: "",
  teacherName: "",
});

const toForm = (course: Course): CourseFormState => ({
  code: course.code,
  name: course.name,
  credits: String(course.credits),
  teacherName: course.teacherName,
});

const validate = (
  form: CourseFormState,
  existing: Course[],
  editingId: string | null
): CourseFormErrors => {
  const errors: CourseFormErrors = {};

  if (!form.code.trim()) errors.code = "Course code is required";
  else if (!/^[A-Za-z]{2,5}\d{2,4}$/.test(form.code.trim()))
    errors.code = "Format example: CS101";

  if (!form.name.trim()) errors.name = "Course name is required";

  const creditsNum = Number(form.credits);
  if (!form.credits.trim()) errors.credits = "Credits required";
  else if (!Number.isFinite(creditsNum) || creditsNum < 0 || creditsNum > 30)
    errors.credits = "Credits must be 0–30";

  if (!form.teacherName.trim())
    errors.teacherName = "Teacher name is required";

  const normalizedCode = form.code.trim().toUpperCase();
  const duplicate = existing.some(
    (c) => c.code.toUpperCase() === normalizedCode && c.id !== editingId
  );
  if (duplicate) errors.code = "Course code already exists";

  return errors;
};

/* ---------- Mobile Card ---------- */

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  disabled,
}: {
  course: Course;
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={1}>
        <Typography variant="h6">{course.code}</Typography>
        <Typography>{course.name}</Typography>
        <Typography variant="body2">Credits: {course.credits}</Typography>
        <Typography variant="body2">Teacher: {course.teacherName}</Typography>

        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => onEdit(course)} disabled={disabled}>
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => onDelete(course.id!)}
            disabled={disabled}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

/* ---------- Component ---------- */

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormState>(emptyForm);
  const [errors, setErrors] = useState<CourseFormErrors>({});

  const [isLoading, setIsLoading] = useState<boolean>(false); // comment: loading list
  const [actionLoading, setActionLoading] = useState<boolean>(false); // comment: saving/deleting
  const [loadError, setLoadError] = useState<string | null>(null); // comment: error text

  /* ---------- Load ---------- */

  const loadCourses = async (): Promise<void> => {
    setIsLoading(true); // comment: start loading
    setLoadError(null); // comment: clear errors
    try {
      const data = await getCourses(); // comment: fetch courses
      setCourses(data); // comment: set state
    } catch {
      setLoadError("Failed to load courses. Please try again."); // comment: set error
    } finally {
      setIsLoading(false); // comment: end loading
    }
  };

  useEffect(() => {
    void loadCourses(); // comment: initial load
  }, []);

  /* ---------- Filter ---------- */

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [courses, search]);

  /* ---------- Handlers ---------- */

  const openAdd = (): void => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (course: Course): void => {
    setEditingId(course.id!);
    setForm(toForm(course));
    setErrors({});
    setDialogOpen(true);
  };

  const closeDialog = (): void => setDialogOpen(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSave = async (): Promise<void> => {
    const validation = validate(form, courses, editingId);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const payload: Omit<Course, "id"> = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      credits: Number(form.credits),
      teacherName: form.teacherName.trim(),
      createdAt: Date.now(),
    };

    setActionLoading(true); // comment: start action loader
    setLoadError(null); // comment: clear error
    try {
      if (editingId === null) {
        await createCourse(payload);
      } else {
        await updateCourse(editingId, payload);
      }

      closeDialog();
      await loadCourses();
    } catch {
      setLoadError("Failed to save course. Please try again.");
    } finally {
      setActionLoading(false); // comment: end action loader
    }
  };

  const onDelete = async (id: string): Promise<void> => {
    setActionLoading(true); // comment: start action loader
    setLoadError(null); // comment: clear error
    try {
      await removeCourse(id);
      await loadCourses();
    } catch {
      setLoadError("Failed to delete course. Please try again.");
    } finally {
      setActionLoading(false); // comment: end action loader
    }
  };

  /* ---------- Render ---------- */

  return (
    <PageLayout title="Course Management">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by code or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          disabled={isLoading || actionLoading}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          disabled={isLoading || actionLoading}
        >
          Add Course
        </Button>
      </Stack>

      {(isLoading || actionLoading) && <LinearProgress sx={{ mb: 2 }} />}

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Total courses: {courses.length}
      </Typography>

      {/* ===== MOBILE ===== */}
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <Stack spacing={2}>
          {filteredCourses.length === 0 ? (
            <Typography align="center">No courses found</Typography>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={openEdit}
                onDelete={onDelete}
                disabled={isLoading || actionLoading}
              />
            ))
          )}
        </Stack>
      </Box>

      {/* ===== DESKTOP ===== */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{course.teacherName}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEdit(course)}
                        disabled={isLoading || actionLoading}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => void onDelete(course.id!)}
                        disabled={isLoading || actionLoading}
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

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId === null ? "Add Course" : "Edit Course"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              name="code"
              label="Course Code (CS101)"
              value={form.code}
              onChange={onChange}
              error={Boolean(errors.code)}
              helperText={errors.code}
              fullWidth
              disabled={actionLoading}
            />
            <TextField
              name="name"
              label="Course Name"
              value={form.name}
              onChange={onChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
              disabled={actionLoading}
            />
            <TextField
              name="credits"
              label="Credits"
              value={form.credits}
              onChange={onChange}
              error={Boolean(errors.credits)}
              helperText={errors.credits}
              fullWidth
              disabled={actionLoading}
            />
            <TextField
              name="teacherName"
              label="Teacher Name"
              value={form.teacherName}
              onChange={onChange}
              error={Boolean(errors.teacherName)}
              helperText={errors.teacherName}
              fullWidth
              disabled={actionLoading}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => void onSave()} disabled={actionLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default Courses;

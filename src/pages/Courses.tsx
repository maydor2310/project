import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import type { Course } from "../models/course";

import {
  getCourses,
  createCourse,
  updateCourse,
  removeCourse,
} from "../services/courseService";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
}: {
  course: Course;
  onEdit: (c: Course) => void;
  onDelete: (id: string) => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={1}>
        <Typography variant="h6">{course.code}</Typography>
        <Typography>{course.name}</Typography>
        <Typography variant="body2">
          Credits: {course.credits}
        </Typography>
        <Typography variant="body2">
          Teacher: {course.teacherName}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => onEdit(course)}>
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => onDelete(course.id!)}
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

  const isMobile = useMediaQuery("(max-width: 600px)");


  /* ---------- Load ---------- */

  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* ---------- Derived ---------- */

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [courses, search]);

  /* ---------- Handlers ---------- */

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course.id!);
    setForm(toForm(course));
    setErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSave = async () => {
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

    if (editingId === null) {
      await createCourse(payload);
    } else {
      await updateCourse(editingId, payload);
    }

    closeDialog();
    loadCourses();
  };

  const onDelete = async (id: string) => {
    await removeCourse(id);
    loadCourses();
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
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Course
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Total courses: {courses.length}
      </Typography>

      {isMobile ? (
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
              />
            ))
          )}
        </Stack>
      ) : (
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
                      <IconButton onClick={() => openEdit(course)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(course.id!)}
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
      )}

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingId === null ? "Add Course" : "Edit Course"}
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <TextField
                name="code"
                label="Course Code (CS101)"
                value={form.code}
                onChange={onChange}
                error={Boolean(errors.code)}
                helperText={errors.code}
                fullWidth
              />

              <TextField
                name="name"
                label="Course Name"
                value={form.name}
                onChange={onChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                fullWidth
              />

              <TextField
                name="credits"
                label="Credits"
                value={form.credits}
                onChange={onChange}
                error={Boolean(errors.credits)}
                helperText={errors.credits}
                fullWidth
              />

              <TextField
                name="teacherName"
                label="Teacher Name"
                value={form.teacherName}
                onChange={onChange}
                error={Boolean(errors.teacherName)}
                helperText={errors.teacherName}
                fullWidth
              />
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default Courses;

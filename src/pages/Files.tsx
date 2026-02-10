import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import type { Course } from "../models/course";
import type { CourseFile } from "../models/courseFile";
import { getCourses } from "../services/courseService";
import { createCourseFile, getCourseFiles, removeCourseFile } from "../services/fileService";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

const Files: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [pickedFile, setPickedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWorking, setIsWorking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const courseNameById = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => map.set(c.id!, `${c.code} - ${c.name}`));
    return map;
  }, [courses]);

  const filesForSelectedCourse = useMemo(() => {
    if (!selectedCourseId) return files;
    return files.filter((f) => f.courseId === selectedCourseId);
  }, [files, selectedCourseId]);

  const loadAll = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const [c, f] = await Promise.all([getCourses(), getCourseFiles()]);
      setCourses(c);
      setFiles(f);
    } catch {
      setError("טעינת נתונים נכשלה");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setError(null);
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setPickedFile(file);
  };

  const resetForm = (): void => {
    setDisplayName("");
    setPickedFile(null);
    setError(null);
  };

  const handleUpload = async (): Promise<void> => {
    setError(null);

    if (!selectedCourseId) {
      setError("Please select a course");
      return;
    }

    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    if (!pickedFile) {
      setError("Please choose a file");
      return;
    }

    const MAX_BYTES = 2_000_000;
    if (pickedFile.size > MAX_BYTES) {
      setError("File is too large (max 2MB for this demo)");
      return;
    }

    setIsWorking(true);
    try {
      const dataUrl = await fileToDataUrl(pickedFile);

      await createCourseFile({
        courseId: selectedCourseId,
        displayName: displayName.trim(),
        originalName: pickedFile.name,
        mimeType: pickedFile.type || "application/octet-stream",
        sizeBytes: pickedFile.size,
        dataUrl,
        createdAt: Date.now(),
      });

      resetForm();
      await loadAll();
    } catch {
      setError("Upload failed");
    } finally {
      setIsWorking(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    setError(null);
    const ok = window.confirm("Delete this file?");
    if (!ok) return;

    setIsWorking(true);
    try {
      await removeCourseFile(id);
      await loadAll();
    } catch {
      setError("Delete failed");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <PageLayout title="Course Files Management">
      {(isLoading || isWorking) && <LinearProgress sx={{ mb: 2 }} />}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload files per course and manage existing files.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <FormControl fullWidth disabled={isWorking}>
            <InputLabel id="course-select-label">Course</InputLabel>
            <Select
              labelId="course-select-label"
              label="Course"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(String(e.target.value))}
            >
              {courses.length === 0 ? (
                <MenuItem value="" disabled>
                  No courses yet (add courses first)
                </MenuItem>
              ) : (
                courses.map((c) => (
                  <MenuItem key={c.id} value={c.id!}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullWidth
            disabled={isWorking}
          />

          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              disabled={isWorking}
            >
              Choose File
              <input type="file" hidden onChange={handlePickFile} />
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {pickedFile
                ? `Selected: ${pickedFile.name} (${pickedFile.size} bytes)`
                : "No file selected"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => void handleUpload()}
            disabled={courses.length === 0 || isWorking}
          >
            Upload
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Existing Files
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing: {selectedCourseId ? "selected course files" : "all files"} — Total:{" "}
        {filesForSelectedCourse.length}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Original File</TableCell>
              <TableCell>Size</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filesForSelectedCourse.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No files found.
                </TableCell>
              </TableRow>
            ) : (
              filesForSelectedCourse.map((f) => (
                <TableRow key={f.id}>
                  <TableCell>{courseNameById.get(f.courseId) || "Unknown course"}</TableCell>
                  <TableCell>{f.displayName}</TableCell>
                  <TableCell>
                    <a href={f.dataUrl} download={f.originalName}>
                      {f.originalName}
                    </a>
                  </TableCell>
                  <TableCell>{f.sizeBytes} bytes</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete file"
                      onClick={() => void handleDelete(f.id)}
                      disabled={isWorking}
                      color="error"
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
    </PageLayout>
  );
};

export default Files;

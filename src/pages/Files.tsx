import React, { useEffect, useMemo, useState } from "react"; // comment: react hooks
import PageLayout from "../components/PageLayout"; // comment: layout
import { COURSES_KEY, FILES_KEY } from "../constants/storageKeys"; // comment: storage keys
import type { Course } from "../models/course"; // comment: course type
import type { CourseFile } from "../models/courseFile"; // comment: file type

import {
  Box, // comment: layout box
  Button, // comment: button
  FormControl, // comment: form control
  InputLabel, // comment: label for select
  MenuItem, // comment: select item
  Paper, // comment: paper container
  Select, // comment: select component
  Stack, // comment: stack layout
  Table, // comment: table
  TableBody, // comment: table body
  TableCell, // comment: table cell
  TableContainer, // comment: container
  TableHead, // comment: head
  TableRow, // comment: row
  TextField, // comment: input
  Typography, // comment: text
  IconButton, // comment: icon button
} from "@mui/material"; // comment: MUI
import DeleteIcon from "@mui/icons-material/Delete"; // comment: delete icon
import UploadFileIcon from "@mui/icons-material/UploadFile"; // comment: upload icon

// comment: safe id generator
const generateId = (): string => { // comment: gen id
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) { // comment: check uuid
    return crypto.randomUUID(); // comment: uuid
  } // comment: end if
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`; // comment: fallback
}; // comment: end gen

// comment: load courses from localStorage
const loadCourses = (): Course[] => { // comment: load courses
  try { // comment: try parse
    const raw = localStorage.getItem(COURSES_KEY); // comment: read raw
    if (!raw) return []; // comment: empty
    const parsed = JSON.parse(raw); // comment: parse
    return Array.isArray(parsed) ? (parsed as Course[]) : []; // comment: validate
  } catch { // comment: catch
    return []; // comment: fallback
  } // comment: end
}; // comment: end load

// comment: load files from localStorage
const loadFiles = (): CourseFile[] => { // comment: load files
  try { // comment: try
    const raw = localStorage.getItem(FILES_KEY); // comment: raw
    if (!raw) return []; // comment: empty
    const parsed = JSON.parse(raw); // comment: parse
    return Array.isArray(parsed) ? (parsed as CourseFile[]) : []; // comment: validate
  } catch { // comment: catch
    return []; // comment: fallback
  } // comment: end
}; // comment: end load

// comment: save files to localStorage
const saveFiles = (files: CourseFile[]): void => { // comment: save files
  localStorage.setItem(FILES_KEY, JSON.stringify(files)); // comment: persist
}; // comment: end save

// comment: read file as data url (base64)
const fileToDataUrl = (file: File): Promise<string> => { // comment: convert file
  return new Promise((resolve, reject) => { // comment: promise
    const reader = new FileReader(); // comment: file reader
    reader.onload = () => resolve(String(reader.result)); // comment: resolve data url
    reader.onerror = () => reject(new Error("Failed to read file")); // comment: reject
    reader.readAsDataURL(file); // comment: read as data url
  }); // comment: end promise
}; // comment: end helper

const Files: React.FC = () => { // comment: files page
  const [courses] = useState<Course[]>(() => loadCourses()); // comment: courses list (static)
  const [files, setFiles] = useState<CourseFile[]>(() => loadFiles()); // comment: files state

  const [selectedCourseId, setSelectedCourseId] = useState<string>(""); // comment: selected course
  const [displayName, setDisplayName] = useState<string>(""); // comment: display name
  const [pickedFile, setPickedFile] = useState<File | null>(null); // comment: chosen file
  const [error, setError] = useState<string>(""); // comment: error message

  useEffect(() => { // comment: persist on change
    saveFiles(files); // comment: save
  }, [files]); // comment: dependency

  const courseNameById = useMemo(() => { // comment: map course id -> display label
    const map = new Map<string, string>(); // comment: init map
    courses.forEach((c) => map.set(c.id, `${c.code} - ${c.name}`)); // comment: fill map
    return map; // comment: return map
  }, [courses]); // comment: deps

  const filesForSelectedCourse = useMemo(() => { // comment: filter files by selected course
    if (!selectedCourseId) return files; // comment: if no selection show all
    return files.filter((f) => f.courseId === selectedCourseId); // comment: filter
  }, [files, selectedCourseId]); // comment: deps

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>): void => { // comment: handle file input
    setError(""); // comment: clear error
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null; // comment: first file
    setPickedFile(file); // comment: set chosen file
  }; // comment: end pick handler

  const resetForm = (): void => { // comment: reset inputs
    setDisplayName(""); // comment: reset display name
    setPickedFile(null); // comment: reset file
    setError(""); // comment: clear error
  }; // comment: end reset

  const handleUpload = async (): Promise<void> => { // comment: upload handler
    setError(""); // comment: clear error

    if (!selectedCourseId) { // comment: validate course selection
      setError("Please select a course"); // comment: error message
      return; // comment: stop
    } // comment: end if

    if (!displayName.trim()) { // comment: validate display name
      setError("Display name is required"); // comment: error
      return; // comment: stop
    } // comment: end if

    if (!pickedFile) { // comment: validate file chosen
      setError("Please choose a file"); // comment: error
      return; // comment: stop
    } // comment: end if

    // comment: optional safety: limit size to avoid localStorage crash
    const MAX_BYTES = 2_000_000; // comment: 2MB limit
    if (pickedFile.size > MAX_BYTES) { // comment: size check
      setError("File is too large for localStorage (max 2MB)"); // comment: size error
      return; // comment: stop
    } // comment: end size check

    const dataUrl = await fileToDataUrl(pickedFile); // comment: convert file to base64

    const newFile: CourseFile = { // comment: create file record
      id: generateId(), // comment: id
      courseId: selectedCourseId, // comment: related course
      displayName: displayName.trim(), // comment: display name
      originalName: pickedFile.name, // comment: original name
      mimeType: pickedFile.type || "application/octet-stream", // comment: mime
      sizeBytes: pickedFile.size, // comment: size
      dataUrl, // comment: base64 data url
      createdAt: Date.now(), // comment: timestamp
    }; // comment: end record

    setFiles((prev) => [newFile, ...prev]); // comment: add to list
    resetForm(); // comment: reset after upload
  }; // comment: end upload

  const handleDelete = (id: string): void => { // comment: delete handler
    const ok = window.confirm("Delete this file?"); // comment: confirm
    if (!ok) return; // comment: stop
    setFiles((prev) => prev.filter((f) => f.id !== id)); // comment: remove
  }; // comment: end delete

  return ( // comment: render
    <PageLayout title="Course Files Management">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> {/* comment: hint */}
        Upload files per course and manage existing files.
      </Typography>

      {/* ===== Upload Form ===== */}
      <Paper sx={{ p: 2, mb: 3 }}> {/* comment: form card */}
        <Stack spacing={2}> {/* comment: spacing */}
          <FormControl fullWidth> {/* comment: course select wrapper */}
            <InputLabel id="course-select-label">Course</InputLabel> {/* comment: label */}
            <Select
              labelId="course-select-label" // comment: label id
              label="Course" // comment: label text
              value={selectedCourseId} // comment: selected value
              onChange={(e) => setSelectedCourseId(String(e.target.value))} // comment: set course
            >
              {courses.length === 0 ? ( // comment: empty courses state
                <MenuItem value="" disabled> {/* comment: disabled item */}
                  No courses yet (add courses first)
                </MenuItem>
              ) : (
                courses.map((c) => ( // comment: course options
                  <MenuItem key={c.id} value={c.id}> {/* comment: one option */}
                    {c.code} - {c.name} {/* comment: label */}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Display Name" // comment: display name label
            value={displayName} // comment: controlled value
            onChange={(e) => setDisplayName(e.target.value)} // comment: update
            fullWidth // comment: full width
          />

          <Box> {/* comment: file input wrapper */}
            <Button
              component="label" // comment: label button
              variant="outlined" // comment: outlined style
              startIcon={<UploadFileIcon />} // comment: icon
            >
              Choose File
              <input type="file" hidden onChange={handlePickFile} /> {/* comment: hidden input */}
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}> {/* comment: file chosen label */}
              {pickedFile ? `Selected: ${pickedFile.name} (${pickedFile.size} bytes)` : "No file selected"}
            </Typography>
          </Box>

          {error ? ( // comment: error display
            <Typography color="error">{error}</Typography>
          ) : null}

          <Button variant="contained" onClick={handleUpload} disabled={courses.length === 0}> {/* comment: upload */}
            Upload
          </Button>
        </Stack>
      </Paper>

      {/* ===== Files Table ===== */}
      <Typography variant="h6" sx={{ mb: 1 }}> {/* comment: title */}
        Existing Files
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}> {/* comment: info */}
        Showing: {selectedCourseId ? "selected course files" : "all files"} — Total: {filesForSelectedCourse.length}
      </Typography>

      <TableContainer component={Paper}> {/* comment: table wrapper */}
        <Table> {/* comment: table */}
          <TableHead> {/* comment: header */}
            <TableRow> {/* comment: row */}
              <TableCell>Course</TableCell> {/* comment: course column */}
              <TableCell>Display Name</TableCell> {/* comment: display column */}
              <TableCell>Original File</TableCell> {/* comment: original name */}
              <TableCell>Size</TableCell> {/* comment: size */}
              <TableCell align="right">Actions</TableCell> {/* comment: actions */}
            </TableRow>
          </TableHead>

          <TableBody> {/* comment: body */}
            {filesForSelectedCourse.length === 0 ? ( // comment: empty state
              <TableRow> {/* comment: empty row */}
                <TableCell colSpan={5} align="center">No files found.</TableCell> {/* comment: message */}
              </TableRow>
            ) : (
              filesForSelectedCourse.map((f) => ( // comment: map rows
                <TableRow key={f.id}> {/* comment: row */}
                  <TableCell>{courseNameById.get(f.courseId) || "Unknown course"}</TableCell> {/* comment: course label */}
                  <TableCell>{f.displayName}</TableCell> {/* comment: display */}
                  <TableCell>
                    <a href={f.dataUrl} download={f.originalName}> {/* comment: download link */}
                      {f.originalName}
                    </a>
                  </TableCell>
                  <TableCell>{f.sizeBytes} bytes</TableCell> {/* comment: size */}
                  <TableCell align="right"> {/* comment: actions */}
                    <IconButton aria-label="delete file" onClick={() => handleDelete(f.id)}> {/* comment: delete */}
                      <DeleteIcon /> {/* comment: delete icon */}
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
// REVIEW: included for peer review

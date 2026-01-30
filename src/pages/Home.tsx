// Home.tsx

import React from "react"; // import React
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material"; // import MUI components
import { useNavigate } from "react-router-dom"; // import navigation hook
import PageLayout from "../components/PageLayout"; // import layout component

// localStorage keys
const COURSES_KEY = "courses_v1";
const TEACHERS_KEY = "teachers_v1";
const FILES_KEY = "files_v1";

// helper function to count items in localStorage
const countFromStorage = (key: string): number => {
  try {
    const raw = localStorage.getItem(key); // read from storage
    if (!raw) return 0; // if empty return 0
    const parsed = JSON.parse(raw); // parse JSON
    return Array.isArray(parsed) ? parsed.length : 0; // count array items
  } catch {
    return 0; // fallback on error
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate(); // router navigation

  // dashboard statistics
  const stats = {
    courses: countFromStorage(COURSES_KEY),
    teachers: countFromStorage(TEACHERS_KEY),
    files: countFromStorage(FILES_KEY),
  };

  return (
    <PageLayout title="Dashboard">
      {/* Page subtitle */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        System Overview
      </Typography>

      {/* Cards layout using CSS Grid (stable & responsive) */}
      <Box
        sx={{
          display: "grid", // CSS grid layout
          gridTemplateColumns: {
            xs: "1fr", // 1 column on mobile
            md: "repeat(3, 1fr)", // 3 columns on desktop
          },
          gap: 2, // spacing between cards
          mb: 4, // margin bottom
        }}
      >
        {/* Courses card */}
        <Card>
          <CardContent>
            <Typography color="text.secondary">Courses</Typography>
            <Typography variant="h4">{stats.courses}</Typography>
          </CardContent>
        </Card>

        {/* Teachers card */}
        <Card>
          <CardContent>
            <Typography color="text.secondary">Teachers</Typography>
            <Typography variant="h4">{stats.teachers}</Typography>
          </CardContent>
        </Card>

        {/* Files card */}
        <Card>
          <CardContent>
            <Typography color="text.secondary">Files</Typography>
            <Typography variant="h4">{stats.files}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Actions section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>

      {/* Navigation buttons */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" onClick={() => navigate("/courses")}>
          Add Course
        </Button>
        <Button variant="contained" onClick={() => navigate("/teachers")}>
          Add Teacher
        </Button>
        <Button variant="contained" onClick={() => navigate("/files")}>
          Add File
        </Button>
      </Stack>
    </PageLayout>
  );
};

export default Home; // export component
// REVIEW: included for peer review

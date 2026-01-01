import React, { useMemo } from "react"; // react
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material"; // MUI components
import Grid from "@mui/material/Grid2"; // ✅ Grid החדש
import { useNavigate } from "react-router-dom"; // navigation
import PageLayout from "../components/PageLayout"; // layout

// localStorage keys
const COURSES_KEY = "courses_v1";
const TEACHERS_KEY = "teachers_v1";
const FILES_KEY = "files_v1";

// helper to count items in storage
const countFromStorage = (key: string): number => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  // compute stats once
  const stats = useMemo(() => {
    return {
      courses: countFromStorage(COURSES_KEY),
      teachers: countFromStorage(TEACHERS_KEY),
      files: countFromStorage(FILES_KEY),
    };
  }, []);

  return (
    <PageLayout title="Dashboard">
      {/* ===== Statistics Section ===== */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        System Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Courses</Typography>
              <Typography variant="h4">{stats.courses}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Teachers</Typography>
              <Typography variant="h4">{stats.teachers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Files</Typography>
              <Typography variant="h4">{stats.files}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Quick Actions Section ===== */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>

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

export default Home;

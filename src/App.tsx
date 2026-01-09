import React, { useMemo, useState } from "react"; // comment: react + hooks
import { Routes, Route, Navigate } from "react-router-dom"; // comment: routing
import { ThemeProvider, CssBaseline } from "@mui/material"; // comment: MUI theming
import getTheme from "./theme/theme"; // comment: theme factory

import Header from "./components/Header"; // comment: existing header
import Home from "./pages/Home";
import Forms from "./pages/Forms";
import Help from "./pages/Help";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import Files from "./pages/Files";
import Login from "./pages/Login";

const App: React.FC = () => {
  // comment: theme mode state
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // comment: memoized theme
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header בלי props – כמו שהיה לך */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/files" element={<Files />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;

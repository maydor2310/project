import React, { useMemo, useState } from "react"; // comment: react + hooks
import { Routes, Route, Navigate } from "react-router-dom"; // comment: routing
import { ThemeProvider, CssBaseline } from "@mui/material"; // comment: MUI theming
import getTheme from "./theme/theme"; // comment: theme factory

import { ThemeModeContext } from "./context/ThemeModeContext"; // ✅ חדש

import Header from "./components/Header";
import Home from "./pages/Home";
import Forms from "./pages/Forms";
import Help from "./pages/Help";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import Files from "./pages/Files";
import Login from "./pages/Login";

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  // ✅ כאן באמת משתמשים ב-setMode
  const toggleTheme = (): void => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* ⬅️ Header נשאר בלי props */}
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
    </ThemeModeContext.Provider>
  );
};

export default App;
// REVIEW: included for peer review

import React, { useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, LinearProgress } from "@mui/material";
import getTheme from "./theme/theme";

import { ThemeModeContext } from "./context/ThemeModeContext";

import Header from "./components/Header";
import Home from "./pages/Home";
import Forms from "./pages/Forms";
import Help from "./pages/Help";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import Files from "./pages/Files";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LinearProgress sx={{ mt: 1 }} />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

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
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/forms"
            element={
              <Protected>
                <Forms />
              </Protected>
            }
          />
          <Route
            path="/courses"
            element={
              <Protected>
                <Courses />
              </Protected>
            }
          />
          <Route
            path="/teachers"
            element={
              <Protected>
                <Teachers />
              </Protected>
            }
          />
          <Route
            path="/files"
            element={
              <Protected>
                <Files />
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;

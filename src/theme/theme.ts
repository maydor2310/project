import { createTheme } from "@mui/material/styles"; // comment: MUI theme creator
import type { Theme } from "@mui/material/styles"; // comment: type-only import

// comment: factory function for light / dark theme
const getTheme = (mode: "light" | "dark"): Theme =>
  createTheme({
    direction: "rtl", // comment: Hebrew support
    palette: {
      mode,
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#9c27b0",
      },
    },
    typography: {
      fontFamily: ["Arial", "sans-serif"].join(","),
      h4: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
  });

export default getTheme;
// REVIEW: included for peer review

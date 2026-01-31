import { createContext } from "react";

export type ThemeModeContextType = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextType>({
  mode: "light",
  toggleTheme: () => {},
});
// REVIEW: included for peer review

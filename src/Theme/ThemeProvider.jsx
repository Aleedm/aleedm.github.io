import React, { useState, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import ThemeContext from "./ThemeContext";
import CssBaseline from "@mui/material/CssBaseline";
import { green } from "@mui/material/colors";

const ThemeProvider = ({ children }) => {
  const [mode, setThemeMode] = useState("light");

  const toggleTheme = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          secondary: {
            main: "#4caf50",
            dark: "#357a38",
            light: "#6fbf73",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

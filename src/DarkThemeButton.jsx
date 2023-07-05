import React from "react";
import { IconButton, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const DarkThemeButton = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();

  return (
    <IconButton
      color={theme.palette.mode === "light" ? "primary" : "default"}
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Light Mode" : "Dark Mode"}
    >
      {darkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default DarkThemeButton;

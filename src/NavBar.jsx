import React from "react";
import {
  Tab,
  Tabs,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import { users } from "./mocks/usersMock.js";
import { iterations } from "./helpers/iterations.js";
import DarkThemeButton from "./DarkThemeButton.jsx";

function NavBar(props) {
  const container = {
    display: "flex",
  };
  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  };

  return (
    <div style={container}>
      <Tabs
        value={props.value}
        onChange={props.handleChange}
        aria-label="icon tabs example"
      >
        <Tab label="Taskboard" aria-label="Taskboard" />
        <Tab label="Backlog" aria-label="Backlog" />
        <Tab label="Capacity" aria-label="Capacity" />
        <Tab label="User Stories" aria-label="User Stories" />
      </Tabs>
      <Box sx={{ minWidth: 120, mr: 1, ml: "auto" }}>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Iteration</InputLabel>
          <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: "200px",
                },
              },
            }}
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={props.currentIteration}
            name={"id"}
            label="Iteration"
            onChange={props.handleChangeIteration}
          >
            <MenuItem value={-1} key={"-1"}>
              all
            </MenuItem>
            {iterations.map((i) => (
              <MenuItem key={i.id} value={i.id}>
                {i.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, mr: 1, ml: 1 }}>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Person</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={props.person}
            label="Person"
            defaultValue="Person"
            onChange={props.handleChangePerson}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.name}>
                {u.name}
              </MenuItem>
            ))}
            <MenuItem value={"all"}> All </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DarkThemeButton
        darkMode={props.darkMode}
        toggleDarkMode={props.toggleDarkMode}
      />
      {/* <IconButton aria-label="filter" color="primary">
        <FilterAltIcon />
      </IconButton>
      <IconButton aria-label="settings" color="primary">
        <SettingsIcon />
      </IconButton> */}
      <IconButton
        aria-label="expand"
        color="primary"
        onClick={handleFullscreen}
      >
        <OpenInFullOutlinedIcon />
      </IconButton>
    </div>
  );
}

export default NavBar;

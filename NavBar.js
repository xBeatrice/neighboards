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
import TuneIcon from "@mui/icons-material/Tune";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
//import NestedList from "./NestedList.js";

function NavBar(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [person, setPerson] = React.useState("");

  const handleChangePerson = (event) => {
    setPerson(event.target.value);
  };
  const container = {
    display: "flex",
  };
  return (
    <div style={container}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon tabs example"
      >
        <Tab label="Taskboard" aria-label="Taskboard" />
        <Tab label="Backlog" aria-label="Backlog" />
        <Tab label="Capacity" aria-label="Capacity" />
        <Tab label="Analytics" aria-label="Analytics" />
      </Tabs>
      <Box sx={{ minWidth: 120, mr: 1, ml: "auto" }}>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Iteration</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={props.iteration}
            label="Iteration"
            defaultValue="Iteration"
            onChange={props.handleChangeIteration}
          >
            <MenuItem value={1}>Iteration 1</MenuItem>
            <MenuItem value={2}>Iteration 2</MenuItem>
            <MenuItem value={3}>Iteration 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120, mr: 1, ml: 1 }}>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Person</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={person}
            label="Person"
            defaultValue="Person"
            onChange={handleChangePerson}
          >
            <MenuItem value={1}>Person 1</MenuItem>
            <MenuItem value={2}>Person 2</MenuItem>
            <MenuItem value={3}>Person 3</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <IconButton aria-label="modify" color="primary">
        <TuneIcon />
      </IconButton>
      <IconButton aria-label="filter" color="primary">
        <FilterAltIcon />
      </IconButton>
      <IconButton aria-label="settings" color="primary">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="expand" color="primary">
        <OpenInFullOutlinedIcon />
      </IconButton>
    </div>
  );
}

export default NavBar;

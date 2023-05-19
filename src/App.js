import React from "react";
//import ReactDOM from "react-dom/client";
import Header from "./Header.js";
import NavBar from "./NavBar.js";
import Main from "./Main.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Capacity from "./Capacity.js";

function App({ children }) {
  // const [chosenIteration, setChosenIteration]=React.useState([])

  // const handleChosenIteration = (taskBoard) => {
  //   setChosenIteration()
  // }
  const [iteration, setIteration] = React.useState(-1);

  const handleChangeIteration = (event) => {
    setIteration(event.target.value);
  };
  const [person, setPerson] = React.useState("");

  const handleChangePerson = (event) => {
    setPerson(event.target.value);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Header />
        <NavBar
          person={person}
          handleChangePerson={handleChangePerson}
          iteration={iteration}
          handleChangeIteration={handleChangeIteration}
          handleChange={handleChange}
          value={value}
        />
        {value == 2 ? (
          <Capacity iteration={iteration} />
        ) : (
          <Main person={person} iteration={iteration} />
        )}
      </div>
    </LocalizationProvider>
  );
}

export default App;

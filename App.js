import React from "react";
//import ReactDOM from "react-dom/client";
import Header from "./Header.js";
import NavBar from "./NavBar.js";
import Main from "./Main.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App({ children }) {
  // const [chosenIteration, setChosenIteration]=React.useState([])

  // const handleChosenIteration = (taskBoard) => {
  //   setChosenIteration()
  // }
  const [iteration, setIteration] = React.useState("");

  const handleChangeIteration = (event) => {
    setIteration(event.target.value);
  };
  const [person, setPerson] = React.useState("");

  const handleChangePerson = (event) => {
    setPerson(event.target.value);
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
        />
        <Main person={person} iteration={iteration} />
      </div>
    </LocalizationProvider>
  );
}

export default App;

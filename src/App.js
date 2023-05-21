import React from "react";
//import ReactDOM from "react-dom/client";
import Header from "./Header.js";
import NavBar from "./NavBar.js";
import Main from "./Main.js";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Capacity from "./Capacity.js";
import UsersActivity from "./UsersActivity.js";
import { users as usersMock } from "./mocks/usersMock.js";
import { iterations as iterationsHelper } from "./helpers/iterations.js";

function App({ children }) {
  const [users, setUsers] = React.useState(usersMock);

  const handleUsers = (newUsers) => {
    setUsers(newUsers);
  };

  const [iterations, setIterations] = React.useState(iterationsHelper);

  const handleIterations = (newIterations) => {
    setIterations(newIterations);
  };

  const [currentIteration, setCurrentIteration] = React.useState(-1);

  const handleChangeIteration = (event) => {
    setCurrentIteration(event.target.value);
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
          currentIteration={currentIteration}
          handleChangeIteration={handleChangeIteration}
          handleChange={handleChange}
          value={value}
        />
        {value === 1 ? (
          <UsersActivity
            currentIteration={currentIteration}
            handleUsers={handleUsers}
            handleIterations={handleIterations}
            users={users}
            iterations={iterations}
          />
        ) : value === 2 ? (
          <Capacity
            currentIteration={currentIteration}
            iterations={iterations}
            users={users}
          />
        ) : (
          <Main person={person} currentIteration={currentIteration} />
        )}
      </div>
    </LocalizationProvider>
  );
}

export default App;

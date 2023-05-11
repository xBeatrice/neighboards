import React from "react";
//import ReactDOM from "react-dom/client";
import Header from "./Header.js";
import NavBar from "./NavBar.js";
import Main from "./Main.js";

function App() {
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
  );
}

export default App;

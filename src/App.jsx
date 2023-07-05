import React from "react";
import Header from "./Header.jsx";
import NavBar from "./NavBar.jsx";
import Main from "./Main.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Capacity from "./Capacity.jsx";
import UsersActivity from "./UsersActivity.jsx";
import UserStories from "./UserStories.jsx";
import { users as usersMock } from "./mocks/usersMock.js";
import { iterations as iterationsHelper } from "./helpers/iterations.js";
import { tasks as tasksMock } from "./mocks/taskBoardMock.js";
import { userStories as stories } from "./mocks/UserStoriesMock.js";
import { v4 as uuidv4 } from "uuid";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

function App({ children }) {
  const [darkMode, setDarkMode] = React.useState(false);

  const [tasks, setTasks] = React.useState(tasksMock);

  const [users, setUsers] = React.useState(usersMock);

  const [userStories, setUserStories] = React.useState(stories);

  const [iterations, setIterations] = React.useState(iterationsHelper);

  const [currentIteration, setCurrentIteration] = React.useState(-1);

  const [value, setValue] = React.useState(0);

  const [taskDialogOptions, setTaskDialogOptions] = React.useState({
    isOpen: false,
    isCreating: false,
  });

  const handleUsers = (newUsers) => {
    setUsers(newUsers);
  };

  const handleIterations = (newIterations) => {
    setIterations(newIterations);
  };

  const handleChangeIteration = (event) => {
    setCurrentIteration(event.target.value);
  };
  const [person, setPerson] = React.useState("");

  const handleChangePerson = (event) => {
    setPerson(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveTask = (updatedTask, userStoryIds) => {
    if (taskDialogOptions.isCreating === true) {
      tasks.push(updatedTask);
    } else {
      setTasks((prevItems) =>
        prevItems.map((item) => {
          if (item.id === updatedTask.id) {
            return updatedTask;
          } else {
            return item;
          }
        })
      );
    }

    const clonedUserStories = JSON.parse(JSON.stringify(userStories));

    clonedUserStories.forEach((userStory) => {
      // eslint-disable-next-line eqeqeq
      if (!userStoryIds.some((id) => id == userStory.id)) {
        // eslint-disable-next-line eqeqeq
        userStory.tasks = userStory.tasks.filter((t) => t != updatedTask.id);
        // eslint-disable-next-line eqeqeq
      } else if (!userStory.tasks.some((id) => id == updatedTask.id)) {
        userStory.tasks.push(updatedTask.id);
      }
    });

    setUserStories(clonedUserStories);
  };

  const newTask = {
    id: uuidv4(),
    title: "",
    userId: "",
    state: "",
    isBug: false,
    iteration: "",
    dueDate: null,
    areaPath: "",
    description: "",
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <Header />
          <NavBar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
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
          ) : value === 3 ? (
            <UserStories
              tasks={tasks}
              taskDialogOptions={taskDialogOptions}
              setTaskDialogOptions={setTaskDialogOptions}
              newTask={newTask}
              userStories={userStories}
              handleSaveTask={handleSaveTask}
            />
          ) : (
            <Main
              userStories={userStories}
              taskDialogOptions={taskDialogOptions}
              setTaskDialogOptions={setTaskDialogOptions}
              person={person}
              currentIteration={currentIteration}
              tasks={tasks}
              setTasks={setTasks}
              newTask={newTask}
              handleSaveTask={handleSaveTask}
            />
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

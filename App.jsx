import React from "react";
import Header from "./Header.jsx";
import NavBar from "./NavBar.jsx";
import Main from "./Main.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Capacity from "./Capacity.jsx";
import UsersActivity from "./UsersActivity.jsx";
import UserStories from "./UserStories.jsx";
//import { users as usersMock } from "./mocks/usersMock.js";
import { iterations as iterationsHelper } from "./helpers/iterations.js";
import { tasks as tasksMock } from "./mocks/taskBoardMock.js";
import { userStories as stories } from "./mocks/UserStoriesMock.js";
import { v4 as uuidv4 } from "uuid";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import axios from 'axios';

function App({ children }) {
  const [darkMode, setDarkMode] = React.useState(false);

  const [tasks, setTasks] = React.useState(tasksMock);

  const [users, setUsers] = React.useState([]);

  const [userStories, setUserStories] = React.useState(stories);

  const [iterations, setIterations] = React.useState(iterationsHelper);

  const [currentIteration, setCurrentIteration] = React.useState(-1);

  const [value, setValue] = React.useState(0);

  const [taskDialogOptions, setTaskDialogOptions] = React.useState({
    isOpen: false,
    isCreating: false,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, tasksResponse, userStoriesResponse] = await Promise.all([
          axios.get('https://localhost:44365/users'),
          axios.get('https://localhost:44365/tasks'),
          axios.get('https://localhost:44365/userstories'),
        ]);

        setUsers(usersResponse.data);
        setTasks(tasksResponse.data);
        setUserStories(userStoriesResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [])

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

  const handleSaveTask = async (updatedTask, userStoryIds) => {
    if (taskDialogOptions.isCreating === true) {
      // Send a POST request to create a new task
      const response= await axios.post('https://localhost:44365/tasks/create', updatedTask, {
       
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((createdTask) => {
          // Add the newly created task to the tasks state
          setTasks((prevTasks) => [...prevTasks, createdTask]);
  
          // Update user story tasks
          updateUserStoryTasks(userStoryIds, createdTask.id);
        })
        .catch((error) => {
          console.error('Error creating task:', error);
        });
    } else {
      // Send a PUT request to update an existing task
      const response = await axios.post(`https://localhost:44365/tasks/update/${updatedTask.Id}`, updatedTask, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
  
        .then((updatedTaskResponse) => {
          // Update the tasks state with the updated task
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.Id === updatedTaskResponse.Id ? updatedTaskResponse : task
            )
          );
  
          // Update user story tasks
          updateUserStoryTasks(userStoryIds, updatedTaskResponse.Id);
        })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };
  
  const updateUserStoryTasks = (userStoryIds, taskId) => {
    const clonedUserStories = JSON.parse(JSON.stringify(userStories));
  
    clonedUserStories.forEach((userStory) => {
      if (!userStoryIds.includes(userStory.Id)) {
        userStory.tasks = userStory.tasks.filter((task) => task !== taskId);
      } else if (!userStory.tasks.includes(taskId)) {
        userStory.tasks.push(taskId);
      }
    });
  
    setUserStories(clonedUserStories);
  };
  
  const newTask = {
    Id: uuidv4(),
    Title: "",
    UserId: "",
    State: "",
    IsBug: false,
    Iteration: "",
    DueDate: null,
    AreaPath: "",
    Description: "",
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
            users={users}
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
              tasks={tasks}
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
              users={users}
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

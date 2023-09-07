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
import { iterations } from "./mocks/iterationsMock.js";
import { v4 as uuidv4 } from "uuid";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import axios from 'axios';

function App({ children }) {
  const [darkMode, setDarkMode] = React.useState(false);

  const [tasks, setTasks] = React.useState([]);

  const [users, setUsers] = React.useState([]);

  const [userCapacityList, setUserCapacityList] = React.useState([]);

  const [userStories, setUserStories] = React.useState([]);

  const [currentIteration, setCurrentIteration] = React.useState(0);

  const [value, setValue] = React.useState(0);

  const [taskDialogOptions, setTaskDialogOptions] = React.useState({
    isOpen: false,
    isCreating: false,
  });

  const handleUserCapacityListChange = (value) => {
     value?.forEach(x => {
      const userCapacity = userCapacityList.find(userCapacity => userCapacity.UserId === x.UserId)
      userCapacity.Hours = x.Hours
     })
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, tasksResponse, userStoriesResponse] = await Promise.all([
          axios.get('https://localhost:44365/users'),
          axios.get('https://localhost:44365/tasks'),
          axios.get('https://localhost:44365/userstories')
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

  const handleChangeIteration = async (event) => {
    const iterationId = event.target.value

    setCurrentIteration(iterationId);

    if (iterationId) {
      const { data } = await axios.get('https://localhost:44365/capacity/get/' + iterationId)
      setUserCapacityList(data || [])
    }
    else {
      setUserCapacityList([])
    }
  };

  const [person, setPerson] = React.useState("");

  const handleChangePerson = (event) => {
    setPerson(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveItem = async (item, isTask) => {
    const baseUrl = `https://localhost:44365/${isTask ? 'tasks' : 'userStories'}`

    if (taskDialogOptions.isCreating === true) {
      // Send a POST request to create a new task
      await axios.post(baseUrl + '/create', item, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((createdItem) => {
          // Add the newly created task to the tasks state
          if (isTask){
            setTasks((prevTasks) => [...prevTasks, createdItem]);
          }
          else{
            setUserStories((prevStories) => [...prevStories, createdItem]);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      // Send a PUT request to update an existing task
      await axios.post(`${baseUrl}/update/${item.Id}`, item, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
        .then((updatedItem) => {
          if (isTask) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.Id === updatedItem.Id ? updatedItem : task
              )
            );
          }
          else{
            setUserStories((prevStories) =>
              prevStories.map((story) =>
                  story.Id === updatedItem.Id ? updatedItem : story
                )
              );
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
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
              users={users}
              setUsers={setUsers}
              userCapacityList={userCapacityList}
              setUserCapacityList={handleUserCapacityListChange}
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
              users={users}
              userStories={userStories}
              handleSaveTask={handleSaveItem}
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
              handleSaveTask={handleSaveItem}
            />
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

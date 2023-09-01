import React from "react";
import {
  List,
  ListItem,
  Avatar,
  Typography,
  FormControl,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";

export default function UsersActivity(props) {
  const [activityValues, setActivityValues] = React.useState({});
  const [stateChangeCount, setStateChangeCount] = React.useState(0);

  const handleActivity = (userId) => (event) => {
    setActivityValues((prevValues) => ({
      ...prevValues,
      [userId]: { ...prevValues[userId], activity: event.target.value },
    }));
    setStateChangeCount((prevCount) => prevCount + 1);
  };

  const handleCapacity = (userId) => (event) => {
    const newCapacity = event.target.value !== "" ? parseInt(event.target.value) : undefined;
    setActivityValues((prevValues) => ({
      ...prevValues,
      [userId]: { ...prevValues[userId], capacity: newCapacity },
    }));
    setStateChangeCount((prevCount) => prevCount + 1);
  };

  const handleSave = async () => {
    const updatedUsers = props.users.map((user) => ({
      ...user,
      ...activityValues[user.Id], // Include the updated activity and capacity
    }));
  
    try {
      for (const updatedUser of updatedUsers) {
        await axios.post(
          `https://localhost:44365/users/update/${updatedUser.Id}`,
          updatedUser,
          {
            headers: {
              'Content-Type': 'application/json', // Assuming you're sending JSON data
              // Add other headers if needed
            },
          }
        );
      }
  
      setStateChangeCount(0); // Reset the state change count
      props.handleUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };
  
  

  React.useEffect(() => {
    const initialValues = {};
    props.users.forEach((user) => {
      initialValues[user.Id] = { activity: user.Activity, capacity: user.Capacity };
    });
    setActivityValues(initialValues);
  }, [props.users]);

  return (
    <div>
      {props.currentIteration !== -1 ||
      props.iterations?.some((i) => i.id === props.currentIteration) ? (
        <div>
          <List>
            <ListItem>
              <Typography sx={{ ml: 2 }} variant="h6" color="grey">
                Users
              </Typography>
              <Typography sx={{ ml: 11 }} variant="h6" color="grey">
                Activity
              </Typography>
              <Typography sx={{ ml: 20 }} variant="h6" color="grey">
                Capacity per day
              </Typography>
            </ListItem>
            {props.users.map((u) => (
              <ListItem key={u.Id}>
                <Avatar sx={{ backgroundColor: "#0079bf" }} />
                <Typography variant="h5" sx={{ ml: 2 }}>
                  {u.Name}
                </Typography>
                <FormControl sx={{ width: 200, ml: 3 }}>
                  <Select
                    id={u.Id}
                    value={activityValues[u.Id]?.activity} // Use activityValues[u.Id]?.activity
                    onChange={handleActivity(u.Id)}
                  >
                    <MenuItem value={"development"}>Development</MenuItem>
                    <MenuItem value={"testing"}>Testing</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ ml: 3 }}
                  id={u.Id}
                  onChange={handleCapacity(u.Id)}
                  value={activityValues[u.Id]?.capacity !== undefined ? activityValues[u.Id]?.capacity : ""}
                  variant="outlined"
                 
                />
              </ListItem>
            ))}
          </List>
          {stateChangeCount >= 1 && (
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ ml: 40, mt: 2, width: 80 }}
            >
              Save
            </Button>
          )}
        </div>
      ) : (
        <Typography
          variant="h4"
          color="secondary"
          align="center"
          sx={{ mt: "20%" }}
        >
          Please, select an iteration first! :)
        </Typography>
      )}
    </div>
  );
}

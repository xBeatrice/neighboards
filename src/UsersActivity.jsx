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

export default function UsersActivity(props) {
  const [activityValues, setActivityValues] = React.useState({});
  const [capacityValues, setCapacityValues] = React.useState({});

  const handleActivity = (userId) => (event) => {
    setActivityValues((prevValues) => ({
      ...prevValues,
      [userId]: event.target.value,
    }));
  };

  const handleCapacity = (userId) => (event) => {
    setCapacityValues((prevValues) => ({
      ...prevValues,
      [userId]: event.target.value,
    }));
  };

  const handleSave = () => {
    const updatedUsers = props.users.map((user) => ({
      ...user,
      activity: activityValues[user.id] || user.activity,
    }));

    const updatedIterations = props.iterations.map((iteration) => {
      if (iteration.id === props.currentIteration) {
        const updatedCapacity = {};
        props.users.forEach((user) => {
          const capacityValue = capacityValues[user.id];
          updatedCapacity[user.id] = capacityValue
            ? capacityValue * 5
            : props.iterations.find((i) => i.id === props.currentIteration)
                ?.capacity[user.id];
        });
        return {
          ...iteration,
          capacity: updatedCapacity,
        };
      }
      return iteration;
    });

    props.handleUsers(updatedUsers);
    props.handleIterations(updatedIterations);
  };

  const isChanged =
    Object.keys(activityValues).length > 0 ||
    Object.keys(capacityValues).length > 0;

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
              <ListItem key={u.id}>
                <Avatar sx={{ backgroundColor: "#0079bf" }} />
                <Typography variant="h5" sx={{ ml: 2 }}>
                  {u.name}
                </Typography>
                <FormControl sx={{ width: 200, ml: 3 }}>
                  <Select
                    id={u.id}
                    value={activityValues[u.id] || u.activity}
                    onChange={handleActivity(u.id)}
                  >
                    <MenuItem value={"development"}>Development</MenuItem>
                    <MenuItem value={"testing"}>Testing</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ ml: 3 }}
                  id={u.id}
                  onChange={handleCapacity(u.id)}
                  value={
                    capacityValues[u.id] !== undefined
                      ? capacityValues[u.id]
                      : (
                          props.iterations.find(
                            (i) => i.id === props.currentIteration
                          )?.capacity[u.id] / 5
                        ).toString() || ""
                  }
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
          {isChanged && (
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

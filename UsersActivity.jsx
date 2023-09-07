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
  const [isDirty, setIsDirty] = React.useState(false)
  const [userCapacityList, setUserCapacityList] = React.useState([])
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    setUserCapacityList(props.userCapacityList || [])
  }, [props.userCapacityList])

  React.useEffect(() => {
    setUsers(props.users || [])
  }, [props.users])

  const handleActivityChange = (userId) => (event) => {
    const usersClone = [...users]
    const user = usersClone.find(u => u.Id === userId)
    user.Activity = event.target.value
    user.isUpdated = true

    setUsers(usersClone);
    setIsDirty(true)
  };

  const handleCapacityChange = (userId) => (event) => {
    const newCapacity = event.target.value ? parseInt(event.target.value) : 8;

    const userCapacityListClone = userCapacityList
    const userCapacity = userCapacityListClone.find(x => x.UserId === userId)

    if(!userCapacity){
      userCapacityListClone.push({UserId: userId, IterationId: props.currentIteration, Hours: newCapacity})
    }
    else{
      userCapacity.Hours = newCapacity || 8
    }
    
    setUserCapacityList(userCapacityListClone)
    setIsDirty(true)
  };

  const handleSave = async () => {
    try {
      users.filter(u => u.isUpdated).forEach(async (u) => {
          await axios.post(
            `https://localhost:44365/users/update/${u.Id}`,
            u,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      })
      props.setUsers(users)

      userCapacityList.forEach(async (userCapacity) => {
        await axios.post(
          `https://localhost:44365/capacity/update`,
          {...userCapacity, IterationId: userCapacity.IterationId + ''},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    })
    props.setUserCapacityList(userCapacityList)
    } catch (error) {
      console.error('Error updating user activity capacity:', error);
    } finally{
      setIsDirty(false)
    }
  };

  return (
    <div>
      {props.currentIteration > 0 ? (
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
                    value={u.Activity}
                    onChange={handleActivityChange(u.Id)}
                  >
                    <MenuItem value={"development"}>Development</MenuItem>
                    <MenuItem value={"testing"}>Testing</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  sx={{ ml: 3 }}
                  id={u.Id}
                  onChange={handleCapacityChange(u.Id)}
                  value={userCapacityList.find(x => x.UserId === u.Id)?.Hours}
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
          {isDirty && (
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

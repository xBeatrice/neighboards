import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  Typography,
  Collapse,
  Divider,
  Button,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";


import Clipboard from "./clipboard.svg";
import Bug from "./bug.svg";
import useDeepCompareEffect from "use-deep-compare-effect";
import TaskDialog from "./TaskDialog.jsx";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material";

export default function UserStories(props) {
  const [openStories, setOpenStories] = React.useState({});
  const [stories, setStories] = React.useState([]);

  const handleOpen = (Id) => {
    setOpenStories((prevState) => ({
      ...prevState,
      [Id]: !prevState[Id],
    }));
  };

  const handleSaveTask = (updatedTask, isTask) => {
    props.handleSaveTask(updatedTask, isTask);
    handleCloseTaskDialog();
  };

  const handleCloseTaskDialog = () => {
    props.setTaskDialogOptions({
      ...props.taskDialogOptions,
      isCreating: false,
      isOpen: false,
      selectedTask: null,
    });
  };

  const handleDelete = (currentStory) => {
    if (currentStory) {
      const newStoriesArr = stories.filter((t) => t.Id !== currentStory.Id);
      setStories(newStoriesArr);
      handleCloseTaskDialog();
    }
  };

  useDeepCompareEffect(() => {
    setStories(props.userStories);
  }, [props.userStories]);

  const theme = useTheme();
  const backgroundColor =
    theme.palette.mode === "light" ? "#f0f8ff" : "#333333";

    const formatDate = (dateString) => {
      const timestamp = parseInt(dateString.match(/\d+/)[0], 10);
      const date = new Date(timestamp);
    
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString('en-US', options).replace(/\//g, '.');
    };

  return (
    <div>
      <div style={{ marginLeft: "2%", width: "86%", marginTop: "2%" }}>
        <List>
          <ListItem key={uuidv4()}>
            <Typography sx={{ ml: 12 }} variant="h6" color="grey">
              Title
            </Typography>
            <Typography sx={{ ml: 38 }} variant="h6" color="grey">
              State
            </Typography>
            <Typography
              sx={{ ml: 28, minWidth: 110 }}
              variant="h6"
              color="grey"
            >
              Story Points
            </Typography>
            <Typography sx={{ ml: 20 }} variant="h6" color="grey">
              Due Date
            </Typography>
          </ListItem>
          <Divider sx={{ width: "90%" }} key={uuidv4()} />
          {stories.map((s) => (
            <ListItem key={uuidv4()} sx={{ display: "grid" }}>
              <ListItemButton onClick={() => handleOpen(s.Id)} key={uuidv4()}>
                <EditIcon
                  sx={{ color: "#1976d2" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    props.setTaskDialogOptions({
                      ...props.taskDialogOptions,
                      isCreating: false,
                      isOpen: true,
                      isEditing: true,
                      value: s,
                      isTask: false
                    });
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ ml: 2, maxWidth: 190, minWidth: 250 }}
                >
                  {s.Title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 16, maxWidth: 130, minWidth: 130 }}
                >
                  {s.State}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 23, maxWidth: 70, minWidth: 70 }}
                >
                  {s.StoryPoints}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 20, mr: 8, maxWidth: 70, minWidth: 70 }}
                >
                  {formatDate(s.DueDate)}
                </Typography>
                {openStories[s.Id] ? <ExpandLess /> : <ExpandMore />}
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    props.setTaskDialogOptions({
                      ...props.taskDialogOptions,
                      isCreating: true,
                      isOpen: true,
                      isTask: true
                    });
                  }}
                >
                  <AddIcon />
                </Button>
              </ListItemButton>
              <Collapse in={openStories[s.Id]} timeout="auto" unmountOnExit>
                <List>
                  <ListItem
                    key={uuidv4()}
                    sx={{ display: "grid", backgroundColor }}
                  >
                    {props.tasks
                      // eslint-disable-next-line eqeqeq
                      .filter((t) => s.Tasks && s.Tasks.some((taskId) => taskId == t.Id))

                      .map((task) => (
                        <ListItemButton key={uuidv4()}>
                          <Typography
                            variant="h6"
                            sx={{ maxWidth: 250, minWidth: 250 }}
                          >
                            {task.IsBug ? (
                              <img
                                style={{
                                  verticalAlign: "text-top",
                                  marginRight: "2px",
                                }}
                                alt="bug"
                                src={Bug}
                                height="25px"
                                width="25px"
                              />
                            ) : (
                              <img
                                style={{
                                  verticalAlign: "text-top",
                                  marginRight: "2px",
                                }}
                                alt="clipboard"
                                src={Clipboard}
                                height="25px"
                                width="25px"
                              />
                            )}
                            {task.Title}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ ml: 18.7, maxWidth: 130, minWidth: 130 }}
                          >
                            {task.State}
                          </Typography>

                          {props.users
                            // eslint-disable-next-line eqeqeq
                            .filter((u) => u.Id == task.UserId)
                            .map((username) => (
                              <Typography
                                variant="h6"
                                sx={{ ml: 14, maxWidth: 170, minWidth: 170 }}
                                key={uuidv4()}
                              >
                                Assigned to: {username.Name}
                              </Typography>
                            ))}

                          <Typography
                            variant="h6"
                            sx={{ ml: 11, maxWidth: 190, minWidth: 190 }}
                          >
                            Remaining hours: {task.HoursRemaining}
                          </Typography>
                        </ListItemButton>
                      ))}
                  </ListItem>
                </List>
              </Collapse>
            </ListItem>
          ))}
        </List>
      </div>
      <Button
        variant="outlined"
        sx={{ ml: "2%", mt: "2%" }}
        onClick={(event) => {
          event.stopPropagation();
          props.setTaskDialogOptions({
            ...props.taskDialogOptions,
            isCreating: true,
            isOpen: true,
            isTask: false
          });
        }}
        
      >
        New User Story
      </Button>
      <TaskDialog
        tasks={props.tasks}
        handleClose={handleCloseTaskDialog}
        isOpen={props.taskDialogOptions.isOpen}
        selectedTask={props.taskDialogOptions.selectedTask}
        isCreating={props.taskDialogOptions.isCreating}
        isTask={props.taskDialogOptions.isTask}
        userStories={props.userStories}
        submit={handleSaveTask}
        handleDelete={handleDelete}
        stories={stories}
        users={props.users}
      />
    </div>
  );
}

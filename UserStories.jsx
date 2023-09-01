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
  const [storyDialogOptions, setStoryDialogOptions] = React.useState({
    isOpen: false,
    isCreating: false,
  });

  const newStory = {
    id: uuidv4(),
    title: "",
    state: "",
    dueDate: "",
    description: "",
    comments: [],
    storyPoints: "",
    tasks: [],
  };
  const handleOpen = (Id) => {
    setOpenStories((prevState) => ({
      ...prevState,
      [Id]: !prevState[Id],
    }));
  };

  const handleSaveStory = (updatedStory, ChosenTasks) => {
    if (props.taskDialogOptions.isCreating === true) {
      stories.push({
        ...updatedStory,
        tasks: ChosenTasks,
      });

      props.setTaskDialogOptions({
        ...props.taskDialogOptions,
        isCreating: false,
        isOpen: false,
      });
    } else {
      setStories((prevItems) =>
        prevItems.map((item) => {
          if (item.id === updatedStory.Id) {
            return updatedStory;
          } else {
            return item;
          }
        })
      );
      props.setTaskDialogOptions({
        ...props.taskDialogOptions,
        isOpen: false,
      });
    }
  };

  const handleSaveTask = (updatedTask, userStories) => {
    props.handleSaveTask(
      updatedTask,
      userStories.map((s) => s.Id)
    );
    handleCloseTaskDialog();
  };

  const handleCloseTaskDialog = () => {
    props.setTaskDialogOptions({
      ...props.taskDialogOptions,
      isCreating: false,
      isOpen: false,
      selectedTask: null,
      selectedStory: null,
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
                      currentStory: s,
                      selectedStory: s,
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
                      selectedStory: s,
                      selectedTask: props.newTask,
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
            currentStory: newStory,
            currentTask: undefined,
          });
        }}
        
      >
        New User Story
      </Button>
      <TaskDialog
        tasks={props.tasks}
        handleClose={handleCloseTaskDialog}
        isOpen={props.taskDialogOptions.isOpen}
        selectedStory={props.taskDialogOptions.selectedStory}
        selectedTask={props.taskDialogOptions.selectedTask}
        currentStory={props.taskDialogOptions.currentStory}
        isCreatingStory={props.taskDialogOptions.isCreating}
        setStoryDialogOptions={setStoryDialogOptions}
        userStories={props.userStories}
        submit={handleSaveTask}
        handleSaveStory={handleSaveStory}
        handleDeleteStory={handleDelete}
        stories={stories}
        users={props.users}
      />
    </div>
  );
}

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
import { userStories } from "./mocks/UserStoriesMock.js";
import { users } from "./mocks/usersMock.js";
import Clipboard from "./clipboard.svg";
import Bug from "./bug.svg";
import useDeepCompareEffect from "use-deep-compare-effect";
import TaskDialog from "./TaskDialog.js";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";

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
  const handleOpen = (id) => {
    setOpenStories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
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
          if (item.id === updatedStory.id) {
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
      userStories.map((s) => s.id)
    );
    handleCloseTaskDialog();
  };

  const handleCloseStoryDialog = () => {
    props.setTaskDialogOptions({
      ...props.taskDialogOptions,
      isCreating: false,
      isOpen: false,
    });
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
      const newStoriesArr = stories.filter((t) => t.id !== currentStory.id);
      setStories(newStoriesArr);
      handleCloseTaskDialog();
    }
  };

  useDeepCompareEffect(() => {
    setStories(props.userStories);
  }, [props.userStories]);

  return (
    <div>
      <div style={{ marginLeft: "2%", width: "86%", marginTop: "2%" }}>
        <List>
          <ListItem key={uuidv4()}>
            <Typography sx={{ ml: 7 }} variant="h6" color="grey">
              Title
            </Typography>
            <Typography sx={{ ml: 20 }} variant="h6" color="grey">
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
              <ListItemButton onClick={() => handleOpen(s.id)} key={uuidv4()}>
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
                  sx={{ ml: 2, maxWidth: 70, minWidth: 70 }}
                >
                  {s.title}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 16, maxWidth: 130, minWidth: 130 }}
                >
                  {s.state}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 23, maxWidth: 70, minWidth: 70 }}
                >
                  {s.storyPoints}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ ml: 20, mr: 8, maxWidth: 70, minWidth: 70 }}
                >
                  {s.dueDate.toString()}
                </Typography>
                {openStories[s.id] ? <ExpandLess /> : <ExpandMore />}
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
              <Collapse in={openStories[s.id]} timeout="auto" unmountOnExit>
                <List>
                  <ListItem
                    key={uuidv4()}
                    sx={{ display: "grid", backgroundColor: "#f0f8ff" }}
                  >
                    {props.tasks
                      // eslint-disable-next-line eqeqeq
                      .filter((t) => s.tasks.some((taskId) => taskId == t.id))
                      .map((task) => (
                        <ListItemButton key={uuidv4()}>
                          <Typography
                            variant="h6"
                            sx={{ maxWidth: 100, minWidth: 100 }}
                          >
                            {task.isBug ? (
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
                            {task.title}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ ml: 12, maxWidth: 130, minWidth: 130 }}
                          >
                            {task.state}
                          </Typography>

                          {users
                            // eslint-disable-next-line eqeqeq
                            .filter((u) => u.id == task.userId)
                            .map((username) => (
                              <Typography
                                variant="h6"
                                sx={{ ml: 14, maxWidth: 170, minWidth: 170 }}
                                key={uuidv4()}
                              >
                                Assigned to: {username.name}
                              </Typography>
                            ))}

                          <Typography
                            variant="h6"
                            sx={{ ml: 11, maxWidth: 190, minWidth: 190 }}
                          >
                            Remaining hours: {task.hoursRemaining}
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
          });
        }}
        // onClick={() =>
        //   setStoryDialogOptions({
        //     ...storyDialogOptions,
        //     isCreating: true,
        //     isOpen: true,
        //     newStory: newStory,
        //   })
        // }
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
        userStories={userStories}
        submit={handleSaveTask}
        handleSaveStory={handleSaveStory}
        handleDeleteStory={handleDelete}
        stories={stories}
      />
    </div>
  );
}

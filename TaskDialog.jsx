import * as React from "react";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  Select,
  Slide,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Box,
  Button,
  FormControl,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { states } from "./constants/states.js";
import { iterations } from "./helpers/iterations.js";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CommentArea from "./CommentArea.jsx";
import Comment from "./Comment.jsx";
import DeleteDialog from "./DeleteDialog.jsx";
import { v4 as uuidv4 } from "uuid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TaskDialog(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedStories, setSelectedStories] = React.useState([]);
  const [checked, setChecked] = React.useState(true);
  const [chosenTasks, setChosenTasks] = React.useState([]);

  const handleChosenTasks = (event) => {
    setChosenTasks(event.target.value); // check
  };

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleCloseAll = () => {
    setIsOpen(false);
    if (props.currentStory) {
      props.setStoryDialogOptions({
        ...props.storyDialogOptions,
        isCreating: false,
        isOpen: false,
      });
    } else {
      props.setTaskDialogOptions({
        ...props.taskDialogOptions,
        isCreating: false,
        isOpen: false,
      });
    }
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  const defaultTask = {};

  const [currentTask, setCurrentTask] = React.useState(defaultTask);

  const defaultStory = {
    id: uuidv4(),
    title: "",
    state: "",
    description: "",
    comments: [],
    storyPoints: "",
    tasks: [],
  };
  const [currentStory, setCurrentStory] = React.useState(defaultStory);

  const handleSaveTask = (updatedTask) => {
    props.setTasks((prevItems) =>
      prevItems.map((item) => {
        if (item.id === updatedTask.id) {
          return updatedTask;
        } else {
          return item;
        }
      })
    );
  };

  const handleSelectStories = (event) => {
    setSelectedStories(event.target.value);
  };

  // React.useEffect(() => {
  //   if (props.selectedStory?.id) {
  //     setSelectedStories([props.selectedStory]);
  //     setChosenTasks([props.selectedStory.tasks]);
  //   } else {
  //     setSelectedStories(
  //       props.userStories.filter((s) =>
  //         s.tasks.some((t) => t === currentTask.id)
  //       )
  //     );
  //   }
  // }, [currentTask.id, props.selectedStory, props.userStories]);

  React.useEffect(() => {
    if (props.selectedTask) {
      setCurrentTask(JSON.parse(JSON.stringify(props.selectedTask)));
    } else {
      setCurrentTask(defaultStory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedTask]);

  React.useEffect(() => {
    if (props.currentStory) {
      setCurrentStory(JSON.parse(JSON.stringify(props.currentStory)));
    } else {
      setCurrentStory(defaultTask);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentStory]);

  const handleTaskChange = (event) => {
    // name = key
    const { name, value } = event.target;

    setCurrentTask((prevValues) => ({
      ...prevValues,
      [name]: value,
      Id: prevValues.Id,
    }));
  };

  const handleStoryChange = (event) => {
    // name = key
    const { name, value } = event.target;

    setCurrentStory((prevValues) => ({
      ...prevValues,
      [name]: value,
      Id: prevValues.Id,
    }));
  };

  const handleDueDateChange = (date) => {
    const formattedDate = date.format("DD/MM/YYYY");

    if (props.currentStory) {
      setCurrentStory((prevValues) => ({
        ...prevValues,
        DueDate: dayjs(formattedDate),
      }));
    } else {
      setCurrentTask((prevValues) => ({
        ...prevValues,
        DueDate: dayjs(formattedDate),
      }));
    }
  };

  const handleSubmit = () => {
    props.submit(currentTask, selectedStories);
  };

  const deleteTask = () => {
    props.handleDelete(currentTask);
  };

  const deleteStory = () => {
    props.handleDeleteStory(props.currentStory);
  };

  const handleSaveStory = () => {
    props.handleSaveStory(currentStory, chosenTasks);
    setCurrentStory(defaultStory);
    setChosenTasks([]);
  };

  const theme = useTheme();

  const backgroundColor = theme.palette.mode === "light" ? "white" : "black";

  return (
    <Dialog
      fullScreen
      open={props.isOpen}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <div style={{ overflowy: "scroll" }}>
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: props.currentStory
              ? "#096bde"
              : currentTask
              ? currentTask.IsBug
                ? "#ff4f9b"
                : "#f0b924"
              : "#1976d2",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h3" sx={{ mx: 1, my: 2 }}>
              <FormControl
                sx={{
                  display: "flex",

                  height: 46,
                }}
              >
                {" "}
                <TextField
                  InputProps={{
                    style: {
                      backgroundColor,
                      width: 350,
                    },
                  }}
                  size="small"
                  onChange={
                    props.currentStory ? handleStoryChange : handleTaskChange
                  }
                  name="Title"
                  value={currentStory?.Title || currentTask?.Title}
                  placeholder={
                    props.currentStory
                      ? "Enter story title"
                      : "Enter task title"
                  }
                />{" "}
              </FormControl>
            </Typography>
            <IconButton
              onClick={() => {
                handleClickOpen();
              }}
              sx={{
                backgroundColor: "white",
                color: "red",
                mr: 0,
                ml: "auto",
                mb: 0.7,
              }}
            >
              <DeleteIcon></DeleteIcon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Card
          sx={{
            width: "96%",
            height: 480,
            my: 2,
            mx: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <CardContent sx={{ display: "flex" }}>
            <Box sx={{ minWidth: 700 }}>
              <Box>
                <Box>
                  <TextField
                    sx={{ width: 200, height: 60, mx: 2 }}
                    id="outlined"
                    select
                    label="State"
                    value={
                      props.currentStory && props.currentStory.State
                        ? currentStory.State
                        : currentTask && currentTask.State
                        ? currentTask.State
                        : undefined
                    }
                    name="State"
                    onChange={
                      props.currentStory ? handleStoryChange : handleTaskChange
                    }
                  >
                    {states.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>

              <Typography variant="subtitle1" sx={{ mx: 2, mt: 1 }}>
                <DatePicker
                  sx={{ width: 200, my: 1 }}
                  value={
                    props.currentStory && props.currentStory.DueDate
                      ? dayjs(props.currentStory.DueDate)
                      : currentTask && currentTask.DueDate
                      ? dayjs(currentTask.DueDate)
                      : undefined
                  }
                  format={"DD/MM/YYYY"}
                  label="Due date"
                  name="DueDate"
                  onChange={handleDueDateChange}
                  disableFuture={false}
                />
              </Typography>
              {props.currentStory ? (
                <div>
                  <Typography variant="subtitle1" sx={{ mx: 2, mt: 1 }}>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Story Points"
                      name="StoryPoints"
                      value={
                        props.currentStory && props.currentStory.StoryPoints
                          ? currentStory.StoryPoints
                          : undefined
                      }
                      onChange={handleStoryChange}
                      sx={{ width: 200, my: 1 }}
                    />
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mx: 2, mt: 0.5 }}>
                    <FormControl>
                      <InputLabel id="tasks-select">Tasks</InputLabel>
                      <Select
                        id="tasks-select"
                        labelId="tasks-select"
                        sx={{ width: 550, mt: 1, mb: 1 }}
                        value={chosenTasks}
                        input={<OutlinedInput label="Tasks" />}
                        name="Tasks"
                        multiple
                        onChange={handleChosenTasks}
                      >
                        {props.tasks.map((s) => (
                          <MenuItem key={s.Id} value={s.Id}>
                            {s.Title}
                          </MenuItem>
                        ))}
                        <MenuItem key={"none"} value={"none"}>
                          {" "}
                          None{" "}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Typography>
                </div>
              ) : (
                <div>
                  <Typography variant="subtitle1" sx={{ mx: 2, mt: 1 }}>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Area path"
                      name="AreaPath"
                      value={currentTask ? currentTask.AreaPath : undefined}
                      onChange={handleTaskChange}
                      multiline
                      maxRows={4}
                      sx={{ width: 200, my: 1 }}
                    />
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mx: 2, mt: 1 }}>
                    <FormControl>
                      <TextField
                        select
                        sx={{ width: 200, mt: 1 }}
                        value={currentTask ? currentTask.Iteration : undefined}
                        name="Iteration"
                        label="Iteration"
                        onChange={handleTaskChange}
                      >
                        {iterations.map((i) => (
                          <MenuItem key={i.id} value={i.id}>
                            Iteration {i.id}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Typography>{" "}
                </div>
              )}
              <Box sx={{ display: "flex" }}>
                <Typography variant="subtitle1" sx={{ mx: 2, my: 0.5 }}>
                  <TextField
                    sx={{ width: 550, mt: 1 }}
                    id="outlined-multiline-static"
                    label="Description"
                    name="Description"
                    value={
                      props.currentStory && props.currentStory.Description
                        ? currentStory.Description
                        : currentTask && currentTask.Description
                        ? currentTask.Description
                        : undefined
                    }
                    onChange={
                      props.currentStory ? handleStoryChange : handleTaskChange
                    }
                    multiline
                    rows={4}
                  />
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    height: 60,
                    width: 80,
                    mt: 6,
                  }}
                  onClick={props.currentStory ? handleSaveStory : handleSubmit}
                >
                  {(props.selectedTask &&
                    // eslint-disable-next-line eqeqeq
                    props.tasks.some(
                      // eslint-disable-next-line eqeqeq
                      (task) => task.Id == props.selectedTask.Id
                    )) ||
                  (props.currentStory &&
                    // eslint-disable-next-line eqeqeq
                    props.stories.some((s) => s.Id == props.currentStory.Id))
                    ? "EDIT"
                    : "SAVE"}
                </Button>
              </Box>
            </Box>
            {props.currentStory ? (
              <div></div>
            ) : (
              <Box sx={{ ml: "auto", mr: 1, my: 1 }}>
                <Typography sx={{ mb: 0.5 }}>Hours Completed:</Typography>
                <TextField
                  sx={{ mb: 0.5 }}
                  name="HoursCompleted"
                  value={currentTask ? currentTask.HoursCompleted : null}
                  onChange={handleTaskChange}
                />
                <Typography sx={{ mb: 0.5 }}>Hours Remaining:</Typography>
                <TextField
                  sx={{ mb: 0.5 }}
                  name="HoursRemaining"
                  value={currentTask ? currentTask.HoursRemaining : null}
                  onChange={handleTaskChange}
                />
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  <FormControl>
                    <TextField
                      select
                      sx={{ width: 220, mt: 2 }}
                      name="UserId"
                      value={currentTask ? currentTask.UserId : null}
                      label="Task asignment"
                      onChange={handleTaskChange}
                    >
                      {props.users.map((u) => (
                        <MenuItem key={u.Id} value={u.Id}>
                          {u.Name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Select
                      id="user-story-select"
                      sx={{ width: 220, mt: 2 }}
                      value={selectedStories}
                      label="User Story"
                      multiple
                      onChange={handleSelectStories}
                    >
                      {props.userStories.map((s) => (
                        <MenuItem key={s.Id} value={s}>
                          {s.Title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      value={currentTask.IsBug}
                      checked={currentTask.IsBug ? checked : null}
                      name="IsBug"
                      onClick={handleCheck}
                      onChange={handleTaskChange}
                    />
                  }
                  label="Is bug?"
                />
              </Box>
            )}
          </CardContent>
        </Card>
        {props.isCreatingTask || props.isCreatingStory ? (
          <div></div>
        ) : (
          <div>
            <CommentArea
              currentTask={currentTask}
              handleTaskChange={handleTaskChange}
              handleSaveTask={handleSaveTask}
              setCurrentTask={setCurrentTask}
              currentStory={props.currentStory}
              handleSaveStory={handleSaveStory}
              setCurrentStory={setCurrentStory}
            />
            <Comment currentTask={currentTask} currentStory={currentStory} />
          </div>
        )}
        <DeleteDialog
          currentStory={props.currentStory}
          isOpen={isOpen}
          deleteStory={deleteStory}
          deleteTask={deleteTask}
          handleCloseAll={handleCloseAll}
        />
      </div>
    </Dialog>
  );
}

export default TaskDialog;

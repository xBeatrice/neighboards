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
// import Box from "@mui/joy/Box";
// import Button from "@mui/joy/Button";
// import FormControl from "@mui/joy/FormControl";
import { states } from "./constants/states.js";
import { iterations } from "./helpers/iterations.js";
import { users } from "./mocks/usersMock.js";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CommentArea from "./CommentArea.js";
import Comment from "./Comment.js";
import DeleteDialog from "./DeleteDialog.js";
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

  React.useEffect(() => {
    if (props.selectedStory?.id) {
      setSelectedStories([props.selectedStory]);
      setChosenTasks([props.selectedStory.tasks]);
    } else {
      setSelectedStories(
        props.userStories.filter((s) =>
          s.tasks.some((t) => t === currentTask.id)
        )
      );
    }
  }, [currentTask.id, props.selectedStory, props.userStories]);

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
      id: prevValues.id,
    }));
  };

  const handleStoryChange = (event) => {
    // name = key
    const { name, value } = event.target;

    setCurrentStory((prevValues) => ({
      ...prevValues,
      [name]: value,
      id: prevValues.id,
    }));
  };

  const handleDueDateChange = (date) => {
    const formattedDate = date.format("DD/MM/YYYY");

    if (props.currentStory) {
      setCurrentStory((prevValues) => ({
        ...prevValues,
        dueDate: formattedDate,
      }));
    } else {
      setCurrentTask((prevValues) => ({
        ...prevValues,
        dueDate: formattedDate,
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
              ? currentTask.isBug
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
                  name="title"
                  value={currentStory?.title || currentTask?.title}
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
                      props.currentStory && props.currentStory.state
                        ? currentStory.state
                        : currentTask && currentTask.state
                        ? currentTask.state
                        : undefined
                    }
                    name="state"
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
                    props.currentStory && props.currentStory.dueDate
                      ? dayjs(props.currentStory.dueDate)
                      : currentTask && currentTask.dueDate
                      ? dayjs(currentTask.dueDate)
                      : undefined
                  }
                  format={"DD/MM/YYYY"}
                  label="Due date"
                  name="dueDate"
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
                      name="storyPoints"
                      value={
                        props.currentStory && props.currentStory.storyPoints
                          ? currentStory.storyPoints
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
                        name="tasks"
                        multiple
                        onChange={handleChosenTasks}
                      >
                        {props.tasks.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.title}
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
                      name="areaPath"
                      value={currentTask ? currentTask.areaPath : undefined}
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
                        value={currentTask ? currentTask.iteration : undefined}
                        name="iteration"
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
                    name="description"
                    value={
                      props.currentStory && props.currentStory.description
                        ? currentStory.description
                        : currentTask && currentTask.description
                        ? currentTask.description
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
                      (task) => task.id == props.selectedTask.id
                    )) ||
                  (props.currentStory &&
                    // eslint-disable-next-line eqeqeq
                    props.stories.some((s) => s.id == props.currentStory.id))
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
                  name="hoursCompleted"
                  value={currentTask ? currentTask.hoursCompleted : null}
                  onChange={handleTaskChange}
                />
                <Typography sx={{ mb: 0.5 }}>Hours Remaining:</Typography>
                <TextField
                  sx={{ mb: 0.5 }}
                  name="hoursRemaining"
                  value={currentTask ? currentTask.hoursRemaining : null}
                  onChange={handleTaskChange}
                />
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  <FormControl>
                    <TextField
                      select
                      sx={{ width: 220, mt: 2 }}
                      name="userId"
                      value={currentTask ? currentTask.userId : null}
                      label="Task asignment"
                      onChange={handleTaskChange}
                    >
                      {users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.name}
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
                        <MenuItem key={s.id} value={s}>
                          {s.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      value={currentTask.isBug}
                      checked={currentTask.isBug ? checked : null}
                      name="isBug"
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

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
import { iterations } from "./mocks/iterationsMock.js";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CommentArea from "./CommentArea.jsx";
import Comment from "./Comment.jsx";
import DeleteDialog from "./DeleteDialog.jsx";
import { v4 as uuidv4 } from "uuid";

const defaultTask = {
  Id: uuidv4(),
  Title: "",
  State: "",
  DueDate: "",
  Description: "",
  Comments: [],
  Iteration: "",
  UserId: "",
  HourRemaining: "",
  HoursCompleted: "",
  UserStoryId: ""
}

const defaultUserStory = {
  Id: uuidv4(),
  Title: "",
  State: "",
  DueDate: "",
  Description: "",
  Comments: [],
  StoryPoints: "",
  Tasks: [],
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TaskDialog(props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState(props.isTask ? defaultTask : defaultUserStory);

  const handleClose = () => {
    setIsDeleteDialogOpen(false);

    props.setTaskDialogOptions({
      ...props.taskDialogOptions,
      isCreating: false,
      isOpen: false,
    });
  };

  React.useEffect(() => {
    if (props.selectedTask){
      setCurrentTask(JSON.parse(JSON.stringify(props.selectedTask)));
    }
    else{
      setCurrentTask(props.isTask ? defaultTask : defaultUserStory);
    }
  }, [props.selectedTask, props.isTask]);

  const handleTaskChange = (event) => {
    // name = key
    const { name, value } = event.target;

    setCurrentTask((prevValues) => ({
      ...prevValues,
      [name]: value,
      Id: prevValues.Id,
    }));
  };

  const handleDueDateChange = (date) => {
    const formattedDate = date.format("DD/MM/YYYY");

    setCurrentTask((prevValues) => ({
      ...prevValues,
      DueDate: dayjs(formattedDate),
    }));
  };

  const handleSubmit = () => {
    props.submit(currentTask, props.isTask);
  };

  const deleteTask = () => {
    props.handleDelete(currentTask);
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
            backgroundColor: !props.isTask
              ? "#096bde"
              : currentTask.IsBug
              ? "#ff4f9b"
              : "#f0b924"
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
                  onChange={handleTaskChange}
                  name="Title"
                  value={currentTask.Title}
                  placeholder={
                    !props.isTask
                      ? "Enter story title"
                      : "Enter task title"
                  }
                />{" "}
              </FormControl>
            </Typography>
            <IconButton
              onClick={() => setIsDeleteDialogOpen(true) }
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
                    value={currentTask.State}
                    name="State"
                    onChange={handleTaskChange}
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
                  value={currentTask.DueDate}
                  format={"DD/MM/YYYY"}
                  label="Due date"
                  name="DueDate"
                  onChange={handleDueDateChange}
                  disableFuture={false}
                />
              </Typography>
              {!props.isTask ? (
                <div>
                  <Typography variant="subtitle1" sx={{ mx: 2, mt: 1 }}>
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Story Points"
                      name="StoryPoints"
                      value={currentTask.StoryPoints}
                      onChange={handleTaskChange}
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
                        value={currentTask.Tasks}
                        input={<OutlinedInput label="Tasks" />}
                        name="Tasks"
                        multiple
                        onChange={handleTaskChange}
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
                      value={currentTask.AreaPath}
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
                        value={currentTask.Iteration}
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
                    value={currentTask.Description}
                    onChange={handleTaskChange}
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
                  onClick={handleSubmit}
                >
                  {!props.isCreating
                    ? "EDIT"
                    : "SAVE"}
                </Button>
              </Box>
            </Box>
            {!props.isTask ? (
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
                      name="UserStoryId"
                      sx={{ width: 220, mt: 2 }}
                      value={currentTask ? currentTask.UserStoryId : null}
                      label="User Story"
                      onChange={handleTaskChange}
                    >
                      {props.userStories.map((s) => (
                        <MenuItem key={s.Id} value={s.Id}>
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
                      name="IsBug"
                      onChange={handleTaskChange}
                    />
                  }
                  label="Is bug?"
                />
              </Box>
            )}
          </CardContent>
        </Card>
        {props.isCreating ? (
          <div></div>
        ) : (
          <div>
            <CommentArea
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              isTask={props.isTask}
            />
            <Comment currentTask={currentTask} setCurrentTask={setCurrentTask}/>
          </div>
        )}
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          handleClose={handleClose}
          deleteTask={deleteTask}
          isTask={props.isTask}
        />
      </div>
    </Dialog>
  );
}

export default TaskDialog;

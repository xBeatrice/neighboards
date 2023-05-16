import * as React from "react";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Menu from "@mui/joy/Menu";
//import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Check from "@mui/icons-material/Check";
import { states } from "./constants/states.js";
import { iterations } from "./helpers/iterations.js";
import { users } from "./mocks/usersMock.js";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TaskDialog(props) {
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState("normal");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [checked, setChecked] = React.useState(true);

  const handleCheck = () => {
    setChecked(!checked);
  };

  const defaultTask = { state: "Active" };

  const [currentTask, setCurrentTask] = React.useState(defaultTask);

  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (props.selectedTask) {
      setCurrentTask(JSON.parse(JSON.stringify(props.selectedTask)));
    } else {
      setCurrentTask(defaultTask);
    }
  }, [props.selectedTask]);

  const handleTaskChange = (event) => {
    // name = key
    const { name, value } = event.target;

    setCurrentTask((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleDueDateChange = (date) => {
    setCurrentTask((prevValues) => ({
      ...prevValues,
      dueDate: date,
    }));
  };

  const handleSubmit = () => {
    props.submit(currentTask);
  };

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
            backgroundColor: currentTask
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
                  padding: 1,
                  height: 46,
                }}
              >
                {" "}
                <TextField
                  InputProps={{
                    style: {
                      backgroundColor: "white",
                    },
                  }}
                  size="small"
                  onChange={handleTaskChange}
                  name="title"
                  placeholder="Enter task title"
                />{" "}
              </FormControl>
            </Typography>
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
                    value={currentTask.state}
                    name="state"
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
                  value={dayjs(currentTask.dueDate)}
                  format={"DD MM YYYY"}
                  label="Due date"
                  name="dueDate"
                  onChange={handleDueDateChange}
                />
              </Typography>
              <Typography variant="subtitle1" sx={{ mx: 2, mt: 1 }}>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Area path"
                  name="areaPath"
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
                    value={currentTask.iteration}
                    name="iteration"
                    label="Iteration"
                    onChange={handleTaskChange}
                  >
                    {iterations.map((i) => (
                      <MenuItem key={i} value={i}>
                        Iteration {i}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Typography>
              <Box sx={{ display: "flex" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ mx: 2, my: 1, height: 100 }}
                >
                  <TextField
                    sx={{ width: 550, mt: 1 }}
                    id="outlined-multiline-static"
                    label="Description"
                    name="description"
                    onChange={handleTaskChange}
                    multiline
                    rows={4}
                  />
                </Typography>
                <Button
                  sx={{
                    height: 60,
                    width: 80,
                    mt: 6,
                  }}
                  onClick={handleSubmit}
                >
                  {currentTask.title ? "EDIT" : "SAVE"}
                </Button>
              </Box>
            </Box>
            <Box sx={{ ml: "auto", mr: 1, my: 1 }}>
              <Typography sx={{ mb: 0.5 }}>Hours Completed:</Typography>
              <TextField sx={{ mb: 0.5 }} />
              <Typography sx={{ mb: 0.5 }}>Hours Remaining:</Typography>
              <TextField sx={{ mb: 0.5 }} />
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                <FormControl>
                  <TextField
                    select
                    sx={{ width: 220, mt: 1 }}
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
          </CardContent>
        </Card>

        <FormControl
          sx={{
            mt: 4,
            ml: 2,
            width: 700,
            padding: 1,
            borderRadius: 10,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <FormLabel sx={{ padding: 2 }}>Comment Here! </FormLabel>
          <Textarea
            ref={textareaRef}
            placeholder="Type something here…"
            minRows={6}
            endDecorator={
              <Box
                sx={{
                  display: "flex",
                  gap: "var(--Textarea-paddingBlock)",
                  pt: "var(--Textarea-paddingBlock)",
                  borderTop: "1px solid",
                  borderColor: "divider",
                  flex: "auto",
                }}
              >
                <IconButton
                  variant="plain"
                  color="neutral"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <FormatBold />
                  <KeyboardArrowDown fontSize="md" />
                </IconButton>
                {anchorEl && (
                  <Menu
                    open={!!anchorEl}
                    onClose={() => setAnchorEl(null)}
                    size="sm"
                    placement="bottom-start"
                    sx={{ "--ListItemDecorator-size": "24px", zIndex: "9999" }}
                    anchorEl={anchorEl}
                  >
                    {["200", "normal", "bold"].map((weight) => (
                      <MenuItem
                        key={weight}
                        selected={fontWeight === weight}
                        onClick={() => {
                          setFontWeight(weight);
                          setAnchorEl(null);
                        }}
                        sx={{ fontWeight: weight }}
                      >
                        <ListItemDecorator>
                          {fontWeight === weight && <Check fontSize="sm" />}
                        </ListItemDecorator>
                        {weight === "200" ? "lighter" : weight}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
                <IconButton
                  variant={italic ? "soft" : "plain"}
                  color={italic ? "primary" : "neutral"}
                  aria-pressed={italic}
                  onClick={() => setItalic((bool) => !bool)}
                >
                  <FormatItalic />
                </IconButton>
                <Button onClick={handleSubmit} sx={{ ml: "auto" }}>
                  Post
                </Button>
              </Box>
            }
            sx={{
              border: currentTask.isBug
                ? "2px solid #ff4f9b"
                : "2px solid #f0b924",
              minWidth: 300,
              fontWeight,
              fontStyle: italic ? "italic" : "initial",
            }}
          />
        </FormControl>

        <Card variant="outlined" sx={{ width: 700, my: 2, ml: 2 }}>
          <CardContent>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              {" "}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
}

export default TaskDialog;

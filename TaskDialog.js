import * as React from "react";
import IconButton from "@mui/material/IconButton";
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
} from "@mui/material";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Check from "@mui/icons-material/Check";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TaskDialog(props) {
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState("normal");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [text, setText] = React.useState("");

  const textareaRef = React.useRef(null);

  function handleSubmit() {
    const inputValue = textareaRef.current.firstChild.value;
    setText(inputValue);
  }
  return (
    <Dialog
      fullScreen
      open={props.taskDialog}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <div style={{ overflowy: "scroll" }}>
        <AppBar
          sx={{
            position: "relative",
            backgroundColor: props.selectedTask.isBug ? "#ff4f9b" : "#f0b924",
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
              {" "}
              {props.selectedTask.title ? props.selectedTask.title : ""}
            </Typography>
          </Toolbar>
        </AppBar>
        <Card
          sx={{
            width: "96%",
            my: 2,
            mx: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <CardContent sx={{ display: "flex", padding: 2, mt: 1 }}>
            <Box sx={{ minWidth: 700 }}>
              <Typography variant="subtitle1" sx={{ mx: 2, my: 1 }}>
                {" "}
                State:{" "}
                {props.selectedTask.state ? props.selectedTask.state : ""}
              </Typography>
              <Typography variant="subtitle1" sx={{ mx: 2, my: 1 }}>
                {" "}
                Due date:{" "}
                {props.selectedTask.title ? props.selectedTask.title : ""}
              </Typography>
              <Typography variant="subtitle1" sx={{ mx: 2, my: 1 }}>
                {" "}
                Area path:{" "}
                {props.selectedTask.title ? props.selectedTask.title : ""}
              </Typography>
              <Typography variant="subtitle1" sx={{ mx: 2, my: 1 }}>
                {" "}
                Iteration:{" "}
                {props.selectedTask.title ? props.selectedTask.title : ""}
              </Typography>
              <Card
                sx={{
                  width: "100",
                  mx: 1,
                  mb: 1,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ mx: 2, my: 1, height: 100 }}
                  >
                    {" "}
                    Description:{" "}
                    {props.selectedTask.title ? props.selectedTask.title : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ ml: "auto", mr: 1, my: 1, display: "grid" }}>
              <Typography sx={{ mb: 0.5 }}>Hours Completed:</Typography>
              <TextField sx={{ mb: 0.5 }} />
              <Typography sx={{ mb: 0.5 }}>Hours Remaining:</Typography>
              <TextField sx={{ mb: 0.5 }} />
              <Button>Save</Button>
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
              border: props.selectedTask.isBug
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
              {text}{" "}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
}

export default TaskDialog;

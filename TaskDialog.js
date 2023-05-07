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
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1 }}
            variant="h6"
            component="div"
          ></Typography>
        </Toolbar>
      </AppBar>
      <div>
        <Typography variant="h2" gutterBottom sx={{ mx: 1, my: 2 }}>
          {" "}
          Title: {props.selectedTask.title ? props.selectedTask.title : ""}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mx: 2, my: 2 }}>
          {" "}
          State: {props.selectedTask.state ? props.selectedTask.state : ""}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mx: 2, my: 2 }}>
          {" "}
          Due date: {props.selectedTask.title ? props.selectedTask.title : ""}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mx: 2, my: 2 }}>
          {" "}
          Area path: {props.selectedTask.title ? props.selectedTask.title : ""}
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mx: 2, my: 2 }}>
          {" "}
          Iteration: {props.selectedTask.title ? props.selectedTask.title : ""}
        </Typography>
      </div>
      <div>
        <FormControl sx={{ mt: 4, ml: 2, width: 600 }}>
          <FormLabel>Comment Here! </FormLabel>
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
              minWidth: 300,
              fontWeight,
              fontStyle: italic ? "italic" : "initial",
            }}
          />
        </FormControl>
      </div>
      <Card variant="outlined" sx={{ width: 600, mt: 4, ml: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 18 }} gutterBottom>
            {text}
          </Typography>
        </CardContent>
      </Card>
    </Dialog>
  );
}

export default TaskDialog;

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Button,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TaskDialog(props) {
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
          <Button autoFocus color="inherit" onClick={props.handleClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Typography>Title: {props.selectedTask.title}</Typography>
    </Dialog>
  );
}

export default TaskDialog;

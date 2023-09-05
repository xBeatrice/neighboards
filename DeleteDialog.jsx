import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeleteDialog(props) {
  const handleDelete = () => {
    props.onDelete();
  };
  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.handleClose}>
        <DialogTitle>{"Delete this?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.openCommentId ? (
            <Button
              onClick={() => {
                props.handleClose();
                handleDelete();
              }}
            >
              Delete comment
            </Button>
          ) : (
            <Button
              onClick={() => {
                props.deleteTask();
                props.handleClose();
              }}
            >
              Delete {props.isTask ? "story" : "task"}
            </Button>
          )}
          <Button onClick={props.handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

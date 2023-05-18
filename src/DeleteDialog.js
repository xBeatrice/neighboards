import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeleteDialog(props) {
  const handleDelete = () => {
    props.onDelete(); // Call the onDelete function passed from the parent component
  };
  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.handleClose}>
        <DialogTitle>{"Delete this comment?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.handleClose();
              handleDelete();
            }}
          >
            Yes
          </Button>
          <Button onClick={props.handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

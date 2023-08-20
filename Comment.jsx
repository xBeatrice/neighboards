import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  Button,
  FormControl,
  TextField,
} from "@mui/material";

import { currentUser } from "./mocks/currentUserMock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "./DeleteDialog.jsx";

function getTimeDifference(timestamp) {
  const postTime = new Date(timestamp);
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - postTime.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
}

export default function Comment(props) {
  const [openCommentId, setOpenCommentId] = React.useState(null);
  const [editingId, setEditingId] = React.useState(null);
  const [editedText, setEditedText] = React.useState("");

  const handleClickOpen = (commentId) => {
    setOpenCommentId(commentId);
  };

  const handleClose = () => {
    setOpenCommentId(null);
  };

  const handleSave = (id) => {
    if (props.currentStory?.id) {
      for (let i = 0; i < props.currentStory.comments.length; i++) {
        if (props.currentStory.comments[i].id == id) {
          props.currentStory.comments[i].text = editedText;
          props.currentStory.comments[i].edited = true;
        }
      }
    } else {
      for (let i = 0; i < props.currentTask.comments.length; i++) {
        if (props.currentTask.comments[i].id == id) {
          props.currentTask.comments[i].text = editedText;
          props.currentTask.comments[i].edited = true;
        }
      }
    }

    setEditingId(null); // Reset the editing state
  };

  const handleEdit = (id) => {
    setEditingId(id);
    if (props.currentStory?.id) {
      const editText = props.currentStory.comments.filter((c) => c.id == id);
      setEditedText(editText[0].text);
    } else {
      const editText = props.currentTask.comments.filter((c) => c.id == id);
      setEditedText(editText[0].text);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (props.currentStory?.id) {
      const updatedComments = props.currentStory.comments.filter(
        (c) => c.id !== commentId
      );
      props.currentStory.comments = updatedComments;
    } else {
      const updatedComments = props.currentTask.comments.filter(
        (c) => c.id !== commentId
      );
      props.currentTask.comments = updatedComments;
    }
  };

  let commentsArray = [];

  if (
    props.currentStory?.id &&
    props.currentStory.comments &&
    props.currentStory.comments.length > 0
  ) {
    commentsArray = props.currentStory.comments;
  } else if (
    props.currentTask &&
    props.currentTask.comments &&
    props.currentTask.comments.length > 0
  ) {
    commentsArray = props.currentTask.comments;
  }

  return (
    <div>
      {commentsArray.map((c, index) => (
        <div key={index}>
          {editingId === c.id ? (
            <div key={c.id}>
              <FormControl
                sx={{
                  mt: 1,
                  ml: 2,
                  mb: 2,
                  width: 700,
                  padding: 1,
                  borderRadius: 3,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                }}
              >
                <TextField
                  key={c.id}
                  sx={{
                    minWidth: 300,
                  }}
                  multiline
                  rows={4}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ ml: "auto", mt: 1 }}
                  onClick={() => handleSave(c.id)}
                >
                  Edit
                </Button>
              </FormControl>
            </div>
          ) : (
            <Card
              key={index}
              sx={{
                width: 720,
                my: 2,
                mx: 2,

                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <Avatar
                    src="./user.svg"
                    sx={{
                      mr: 1,
                      height: 30,
                      width: 30,
                      bgcolor: "#0079bf",
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {currentUser}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="gray"
                    sx={{ mr: 1, ml: "auto" }}
                  >
                    {getTimeDifference(c.timestamp)}
                  </Typography>
                </Box>
                <Divider />
                <Typography variant="body1" sx={{ mx: 1, mt: 3, mb: 3 }}>
                  {c.text}
                </Typography>
                {c.edited === true ? (
                  <Typography
                    variant="body1"
                    color="gray"
                    sx={{ textAlign: "end" }}
                  >
                    Edited
                  </Typography>
                ) : null}
                <Divider />

                <Box sx={{ textAlign: "end", color: "#0079bf", mt: 1 }}>
                  <EditIcon sx={{ mr: 1 }} onClick={() => handleEdit(c.id)} />
                  <DeleteIcon
                    sx={{ mr: 1 }}
                    onClick={() => handleClickOpen(c.id)}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
      <DeleteDialog
        isOpen={Boolean(openCommentId)}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        onDelete={() => handleDeleteComment(openCommentId)}
        openCommentId={openCommentId}
      />
    </div>
  );
}

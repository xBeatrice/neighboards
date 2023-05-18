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
} from "@mui/material";
import Textarea from "@mui/joy/Textarea";
import { currentUser } from "./mocks/currentUserMock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "./DeleteDialog.js";

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

  const handleClickOpen = (commentId) => {
    setOpenCommentId(commentId);
  };

  const handleClose = () => {
    setOpenCommentId(null);
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = props.currentTask.comments.filter(
      (c) => c.id !== commentId
    );
    props.currentTask.comments = updatedComments;
  };

  const [editingId, setEditingId] = React.useState(null);
  const [editedText, setEditedText] = React.useState("");

  const handleEdit = (id) => {
    setEditingId(id);
    const editText = props.currentTask.comments.filter((c) => c.id == id);
    setEditedText(editText[0].text);
  };

  const handleSave = (id) => {
    for (let i = 0; i < props.currentTask.comments.length; i++) {
      if (props.currentTask.comments[i].id == id) {
        props.currentTask.comments[i].text = editedText;
        props.currentTask.comments[i].edited = true;
      }
    }

    setEditingId(null); // Reset the editing state
  };

  return (
    <div>
      {props.currentTask.comments
        ? props.currentTask.comments.map((c, index) => (
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
                      borderRadius: 5,
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <Textarea
                      key={c.id}
                      sx={{
                        minWidth: 300,
                      }}
                      minRows={4}
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
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
                          <Button
                            variant="contained"
                            sx={{ ml: "auto" }}
                            onClick={() => handleSave(c.id)}
                          >
                            Edit
                          </Button>
                        </Box>
                      }
                    />
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
                    {c.edited == true ? (
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
                      <EditIcon
                        sx={{ mr: 1 }}
                        onClick={() => handleEdit(c.id)}
                      />
                      <DeleteIcon
                        sx={{ mr: 1 }}
                        onClick={() => handleClickOpen(c.id)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </div>
          ))
        : null}
      <DeleteDialog
        isOpen={Boolean(openCommentId)}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        onDelete={() => handleDeleteComment(openCommentId)}
      />
    </div>
  );
}

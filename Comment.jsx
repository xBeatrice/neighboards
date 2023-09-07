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
import axios from "axios";
import { currentUser } from "./mocks/currentUserMock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const setTaskComments = (comments) => {
    props.setCurrentTask((prevValues) => ({
      ...prevValues,
      Comments: comments,
    }));
  }

  const handleCommentOpen = (index) => {
    const comments = [...props.currentTask.Comments]
    comments[index].isEditing = true

    setTaskComments(comments)
  };
    

  const handleCommentDelete = async (commentId) => {
    const comments = props.currentTask.comments.filter(
      (c) => c.id !== commentId
    );
    
    setTaskComments(comments)

    await axios.get('https://localhost:44365/comments/delete/' + commentId);  
  }

  const handleCommentChange = (index, content) => {
    const comments = [...props.currentTask.Comments]
    comments[index].Content = content

    setTaskComments(comments)
  };

  const handleCommentSave = async (index) => {
    const comments = [...props.currentTask.Comments]
    comments[index].IsEdited = true
    comments[index].isEditing = false

    setTaskComments(comments)

    await axios.post('https://localhost:44365/comments/update/' + comments[index].Id, comments[index], {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

  } 

  


  return (
    <div>
      {props.currentTask.Comments.map((c, index) => (
        <div key={index}>
          {c.isEditing ? (
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
                  value={c.Content}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ ml: "auto", mt: 1 }}
                  onClick={() => handleCommentSave(index)}
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
                  {c.Content}
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
                  <EditIcon sx={{ mr: 1 }} onClick={() => handleCommentOpen(index)} />
                  <DeleteIcon
                    sx={{ mr: 1 }}
                    onClick={() => handleCommentDelete(c.id)}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}

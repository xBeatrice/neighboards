import * as React from "react";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";

export default function CommentArea(props) {
  const textareaRef = React.useRef(null);

  const [commentText, setCommentText] = React.useState("");

  const handleButtonClick = () => {
    if (commentText.trim() !== "") {
      const timestamp = Date.now();
      const id = Math.random().toString(36).substr(2, 9);

      if (props.currentStory?.id) {
        props.setCurrentStory((prevValues) => ({
          ...prevValues,
          comments: [
            ...prevValues.comments,
            { text: commentText, timestamp, id, edited: false },
          ],
        }));
      } else {
        props.setCurrentTask((prevValues) => ({
          ...prevValues,
          comments: [
            ...prevValues.comments,
            { text: commentText, timestamp, id, edited: false },
          ],
        }));
      }
      setCommentText("");
    }
  };

  const handleSubmit = () => {
    if (props.currentStory?.id) {
      props.handleSaveStory(props.currentStory);
    } else {
      props.handleSaveTask(props.currentTask);
    }
  };

  return (
    <FormControl
      sx={{
        mt: 1,
        ml: 2,
        width: 720,
        padding: 1,
        borderRadius: 3,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
      }}
    >
      <FormLabel sx={{ padding: 1 }}>Comment Here! </FormLabel>
      <TextField
        ref={textareaRef}
        placeholder="Type something here…"
        multiline
        rows={4}
        value={commentText}
        name="comments"
        onChange={(e) => setCommentText(e.target.value)}
        sx={{
          borderRadius: 2,
          border: props.currentStory
            ? "2px solid #096bde"
            : props.currentTask.isBug
            ? "2px solid #ff4f9b"
            : "2px solid #f0b924",
          minWidth: 360,
        }}
      ></TextField>
      <Button
        sx={{ ml: "auto", mt: 1 }}
        variant="contained"
        onClick={(handleSubmit, handleButtonClick)}
      >
        Post
      </Button>{" "}
    </FormControl>
  );
}

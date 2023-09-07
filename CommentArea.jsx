import * as React from "react";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import axios from "axios";

export default function CommentArea(props) {
  const textareaRef = React.useRef(null);

  const [commentText, setCommentText] = React.useState("");

  const handleSubmit = async () => {
    const Id = Math.random().toString(36).substr(2, 9);

    const comment = { Content: commentText, Date: Date.now(), Id, IsEdited: false, ItemId: props.currentTask.Id }
    
    await axios.post('https://localhost:44365/comments/create', comment, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(() => {
    props.setCurrentTask((prevValues) => ({
      ...prevValues,
      Comments: [
        ...prevValues.Comments,
        comment,
      ],
    }));
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    setCommentText("");
  })
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
          border: !props.isTask
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
        onClick={(handleSubmit)}
      >
        Post
      </Button>{" "}
    </FormControl>
  );
}

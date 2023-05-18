import * as React from "react";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import Menu from "@mui/joy/Menu";
//import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Check from "@mui/icons-material/Check";
import { Box, IconButton, Button, MenuItem, FormControl } from "@mui/material";

export default function CommentArea(props) {
  const [italic, setItalic] = React.useState(false);
  const [fontWeight, setFontWeight] = React.useState("normal");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const textareaRef = React.useRef(null);

  const [commentText, setCommentText] = React.useState("");

  const handleButtonClick = () => {
    if (commentText.trim() !== "") {
      const timestamp = Date.now();
      const id = Math.random().toString(36).substr(2, 9);

      props.setCurrentTask((prevValues) => ({
        ...prevValues,
        comments: [
          ...prevValues.comments,
          { text: commentText, timestamp, id, edited: false },
        ],
      }));

      setCommentText("");
    }
  };

  const handleSubmit = () => {
    props.handleSaveTask(props.currentTask);
  };

  return (
    <FormControl
      sx={{
        mt: 1,
        ml: 2,
        width: 700,
        padding: 1,
        borderRadius: 5,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
      }}
    >
      <FormLabel sx={{ padding: 1 }}>Comment Here! </FormLabel>
      <Textarea
        ref={textareaRef}
        placeholder="Type something here…"
        minRows={4}
        value={commentText}
        name="comments"
        onChange={(e) => setCommentText(e.target.value)}
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
            <Button
              sx={{ ml: "auto" }}
              onClick={(handleSubmit, handleButtonClick)}
            >
              Post
            </Button>
          </Box>
        }
        sx={{
          border: props.currentTask.isBug
            ? "2px solid #ff4f9b"
            : "2px solid #f0b924",
          minWidth: 300,
          fontWeight,
          fontStyle: italic ? "italic" : "initial",
        }}
      />
    </FormControl>
  );
}

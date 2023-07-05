import boardlogo from "./boardlogo.svg";
import search from "./search.svg";
import { Typography, TextField, InputAdornment, Avatar } from "@mui/material";

function Header() {
  const container = {
    display: "flex",
    height: "70px",
    borderBottom: "2px solid #c3c0c0",
    margin: "auto",
    marginBottom: "6px",
    padding: "10px",
  };

  return (
    <div style={container}>
      <img alt="boardlogo" src={boardlogo} margin="auto" height="50px"></img>
      <Typography variant="h4" margin="auto" marginLeft="10px" color="#0079bf">
        Neighboards
      </Typography>
      <TextField
        id="outlined"
        label="Search here..."
        variant="outlined"
        size="small"
        sx={{ mt: 1, mr: 1, mb: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <img alt="search" src={search} margin="auto" height="30px"></img>
            </InputAdornment>
          ),
        }}
        aria-describedby="search-logo"
        inputProps={{
          "aria-label": "search",
        }}
      ></TextField>
      <Avatar
        src="./user.svg"
        sx={{ mt: 1, mr: 1, mb: 1, bgcolor: "#0079bf" }}
      />
    </div>
  );
}

export default Header;

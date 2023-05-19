import React from "react";
import { LinearProgress, Typography, Box } from "@mui/material";
import { users } from "./mocks/usersMock.js";
import { tasks } from "./mocks/taskBoardMock.js";
import { iterations } from "./helpers/iterations.js";

export default function Capacity(props) {
  // MIN = Minimum expected value
  // MAX = Maximum expected value
  // Function to normalise the values (MIN / MAX could be integrated)
  const normalise = (value) => ((value - 0) * 100) / (48 - 0);
  //<LinearProgress variant="determinate" value={normalise(props.value)} />

  const hoursRemainingByUserId = tasks.reduce((result, task) => {
    const { userId, hoursRemaining } = task;
    if (result[userId]) {
      result[userId] += parseInt(hoursRemaining, 10);
    } else {
      result[userId] = parseInt(hoursRemaining, 10);
    }
    return result;
  }, {});

  console.log(hoursRemainingByUserId);

  return (
    <div>
      {props.iteration === -1 ||
      !iterations?.some((i) => i.id === props.iteration) ? (
        <div>Select an iteration</div>
      ) : (
        users.map((u) => (
          <Box>
            <Typography sx={{ ml: 2, mb: 0.5, mt: 1.5 }} variant="h6">
              {" "}
              {u.name}{" "}
            </Typography>
            <LinearProgress
              sx={{ height: 30, width: "50%", borderRadius: 5 }}
              color="secondary"
              variant="determinate"
              value={normalise(hoursRemainingByUserId[u.id])}
            />
            <Typography>
              {hoursRemainingByUserId[u.id]}h out of
              {iterations.find((i) => i.id === props.iteration).capacity[u.id]}
            </Typography>
          </Box>
        ))
      )}
    </div>
  );
}

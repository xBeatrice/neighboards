import React from "react";
import { LinearProgress, Typography, Box } from "@mui/material";
//import { tasks } from "./mocks/taskBoardMock.js";

export default function Capacity(props) {
  // MIN = Minimum expected value
  // MAX = Maximum expected value
  // Function to normalise the values (MIN / MAX could be integrated)
  const normalise = (value) => ((value - 0) * 100) / (48 - 0);
  //<LinearProgress variant="determinate" value={normalise(props.value)} />

  const hoursRemainingByUserId = props.tasks.reduce((result, task) => {
    const { userId, hoursRemaining } = task;
    if (result[userId]) {
      result[userId] += parseInt(hoursRemaining, 10);
    } else {
      result[userId] = parseInt(hoursRemaining, 10);
    }
    return result;
  }, {});

  const hoursRemainingActivity = props.users.map((user) => {
    const { id, activity } = user;
    return { [activity]: hoursRemainingByUserId[id], user: id };
  });

  const developmentHours = props.iterations.find(
    (i) => i.id === props.currentIteration
  )?.capacity[hoursRemainingActivity.find((i) => i.development).user];

  const testingHours = props.iterations.find(
    (i) => i.id === props.currentIteration
  )?.capacity[hoursRemainingActivity.find((i) => i.testing).user];

  const totalHours = Object.values(hoursRemainingByUserId).reduce(
    (total, current) => total + current,
    0
  );

  const thisIteration = props.iterations.find(
    (iteration) => iteration.id === props.currentIteration
  );
  let totalCapacity;
  if (thisIteration) {
    totalCapacity = Object.values(thisIteration.capacity).reduce(
      (sum, capacity) => sum + capacity,
      0
    );
  }

  const lineStyle = {
    position: "absolute",
    //left: "40%", // Adjust this value to change the line's horizontal position
    transform: `translateX(-50%)`,
    height: "30%",
    width: 3,
    background: "black", // Adjust this color to change the line's color
    zIndex: 1,
    top: `${38.5}%`,
  };

  React.useEffect(() => {}, [props.iterations, props.users]);

  return (
    <div style={{ marginTop: "20px", position: "relative" }}>
      {props.currentIteration === -1 ||
      !props.iterations?.some((i) => i.id === props.currentIteration) ? (
        <Typography
          variant="h4"
          color="secondary"
          align="center"
          sx={{ mt: "20%" }}
        >
          Please, select an iteration first! :)
        </Typography>
      ) : (
        <>
          <Typography variant="h5" sx={{ ml: 3, mb: 1 }}>
            Work
          </Typography>
          <Box sx={{ ml: 2, position: "relative", mb: 1 }}>
            <Typography sx={{ ml: 2, mb: 0.5, mt: 0 }} variant="h6">
              {" "}
              Team{" "}
            </Typography>
            <div
              style={{
                ...lineStyle,
                left: totalCapacity / props.users.length + "%",
              }}
            />
            <LinearProgress
              sx={{
                height: 30,
                width: "50%",
                borderRadius: 5,
              }}
              color={
                totalHours / props.users.length > 40 ? "warning" : "success"
              }
              variant="determinate"
              value={normalise(totalHours / props.users.length)}
            />
            <Typography
              variant="subtitle1"
              color="grey"
              align="center"
              sx={{ mr: 16, mt: 0.2 }}
            >
              {totalHours}h out of {totalCapacity}h
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ ml: 3, mb: 1 }}>
            Work By: Activity
          </Typography>
          <Box sx={{ ml: 2, position: "relative", mb: 1 }}>
            <Typography sx={{ ml: 2, mb: 0.5, mt: 0 }} variant="h6">
              {" "}
              Development{" "}
            </Typography>
            <div
              style={{ ...lineStyle, left: developmentHours.toString() + "%" }}
            />
            <LinearProgress
              sx={{
                height: 30,
                width: "50%",
                borderRadius: 5,
              }}
              color={
                hoursRemainingActivity.find((i) => i.development).development >
                40
                  ? "warning"
                  : "success"
              }
              variant="determinate"
              value={normalise(
                hoursRemainingActivity.find((i) => i.development).development
              )}
            />
            <Typography
              variant="subtitle1"
              color="grey"
              align="center"
              sx={{ mr: 16, mt: 0.2 }}
            >
              {hoursRemainingActivity.find((i) => i.development).development}h
              out of {developmentHours}h
            </Typography>
          </Box>
          <Box sx={{ ml: 2, position: "relative", mb: 1 }}>
            <Typography sx={{ ml: 2, mb: 0.5, mt: 0 }} variant="h6">
              {" "}
              Testing{" "}
            </Typography>
            <div style={{ ...lineStyle, left: testingHours + "%" }} />
            <LinearProgress
              sx={{
                height: 30,
                width: "50%",
                borderRadius: 5,
              }}
              color={
                hoursRemainingActivity.find((i) => i.testing).testing > 40
                  ? "warning"
                  : "success"
              }
              variant="determinate"
              value={normalise(
                hoursRemainingActivity.find((i) => i.testing).testing
              )}
            />
            <Typography
              variant="subtitle1"
              color="grey"
              align="center"
              sx={{ mr: 16, mt: 0.2 }}
            >
              {hoursRemainingActivity.find((i) => i.testing).testing}h out of{" "}
              {testingHours}h
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ ml: 3, mb: 1 }}>
            Work By: Assigned To
          </Typography>
          {props.users.map((u) => (
            <Box sx={{ ml: 2, position: "relative" }} key={u.id}>
              <Typography sx={{ ml: 2, mb: 0.5, mt: 0 }} variant="h6">
                {u.name}
              </Typography>
              <div
                style={{
                  ...lineStyle,
                  left:
                    props.iterations.find(
                      (i) => i.id === props.currentIteration
                    ).capacity[u.id] + "%",
                }}
              />
              <LinearProgress
                sx={{
                  height: 30,
                  width: "50%",
                  borderRadius: 5,
                }}
                color={
                  hoursRemainingByUserId[u.id] > 40 ? "warning" : "success"
                }
                variant="determinate"
                value={normalise(hoursRemainingByUserId[u.id])}
              />
              <Typography
                variant="subtitle1"
                color="grey"
                align="center"
                sx={{ mr: 16, mt: 0.2 }}
              >
                {hoursRemainingByUserId[u.id]}h out of{" "}
                {
                  props.iterations.find((i) => i.id === props.currentIteration)
                    .capacity[u.id]
                }
                h
              </Typography>
            </Box>
          ))}
        </>
      )}
    </div>
  );
}

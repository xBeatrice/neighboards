import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Clipboard from "./clipboard.svg";
import Bug from "./bug.svg";
import TaskDialog from "./TaskDialog.jsx";
import { useTheme } from "@mui/material";

import { states } from "./constants/states.js";
import useDeepCompareEffect from "use-deep-compare-effect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardActionArea,
  Divider,
} from "@mui/material";
import { useRef } from "react";

export default function Main(props) {
  const [expanded, setExpanded] = React.useState([]);

  const [currentTaskBoard, setCurrentTaskBoard] = React.useState([]);

  const [filteredTaskBoard, setFilteredTaskBoard] = React.useState([]);

  const handleTaskClick = (task) => {
    props.setTaskDialogOptions({
      ...props.taskDialogOptions,
      isCreating: false,
      isOpen: !!task,
      selectedTask: task,
    });
  };

  const handleSaveTask = (updatedTask) => {
    props.handleSaveTask(updatedTask, true);
    handleTaskClick(null);
  };

  const handleDelete = (currentTask) => {
    if (currentTask) {
      // Send a GET request to the backend API for task deletion
      fetch(`https://localhost:44365/tasks/delete/${currentTask.Id}`)
        .then((response) => {
          if (response.ok) {
            // If the delete request is successful, update the tasks state and close the dialog
            const newTasksArr = props.tasks.filter((t) => t.Id !== currentTask.Id);
            props.setTasks(newTasksArr);
            handleCloseDialog();
          } else {
            // Handle error cases if needed
            console.error('Error deleting task:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
        });
    }
  };
  
  
  const handleCloseDialog = () => {
    props.setTaskDialogOptions({
      ...props.taskDialogOptions,
      isCreating: false,
      isOpen: false,
    });
  };

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const treeview = useRef(null);

  const getChildrenNodeIds = () => {
    const children = treeview.current?.querySelectorAll("[role=treeitem]");
    const childrenNodeIds = [];
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        let a = i.toString();
        childrenNodeIds.push(a);
      }
    }
    return childrenNodeIds;
  };

  const handleExpandClick = () => {
    const childrenNodeIds = getChildrenNodeIds();
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? childrenNodeIds : []
    );
  };

  useDeepCompareEffect(() => {
    const taskBoard = props.users.map((user) => {
      var userTasks = props.tasks.filter((task) => task.UserId === user.Id);

      let result = [[], [], [], [], [], [], [], [], [], []];

      userTasks.forEach((t) => {
        for (let i = 0; i < states.length; i++) {
          if (t.State === states[i]) {
            let index = 0;
            while (result[index][i]) {
              index++;
            }
            result[index][i] = {
              ...t,
            };
            result[index].length = 6;
          }
        }
      });

      for (let i = 0; i < result.length; i++) {
        result[i] = [...result[i]];
      }

      return { ...user, result };
    });

    setCurrentTaskBoard(taskBoard);
  }, [props.tasks, props.users, props.tasks.length]);

  React.useEffect(() => {
    let taskBoard = JSON.parse(JSON.stringify(currentTaskBoard));

    if (props.person && props.person !== "all") {
      // eslint-disable-next-line eqeqeq
      taskBoard = taskBoard.filter((user) => user.Name == props.person);
    }

    for (let i = 0; i < taskBoard.length; i++) {
      for (let j = 0; j < taskBoard[i].result.length; j++) {
        for (let k = 0; k < taskBoard[i].result[j].length; k++) {
          if (
            props.currentIteration &&
            props.currentIteration !== -1 &&
            taskBoard[i].result[j][k] &&
            taskBoard[i].result[j][k].Iteration !== props.currentIteration
          ) {
            taskBoard[i].result[j][k] = undefined;
          }
        }
      }
      taskBoard[i].result = taskBoard[i].result.filter((row) =>
        row.some((task) => task)
      );
    }

    // Update the state with the filtered taskBoard
    setFilteredTaskBoard(taskBoard);
  }, [props.currentIteration, props.person, currentTaskBoard]);

  const treeViewStyle = {
    display: "flex",
    alignItems: "center",
  };
  const theme = useTheme();
  const cellStyle = {
    borderLeft:
      theme.palette.mode === "light" ? "4px solid white" : "4px solid black",
    borderRight:
      theme.palette.mode === "light" ? "4px solid white" : "4px solid black",
  };
  const borderColor = theme.palette.mode === "light" ? "white" : "black";
  const backgroundColor =
    theme.palette.mode === "light" ? "#e6e6e6" : "#333333";
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 1, display: "flex" }}>
        <Button onClick={handleExpandClick} sx={{ minWidth: 100 }}>
          {expanded.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
        <Table sx={{ mt: 1 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }} align="center">
                Not Started
              </TableCell>
              <TableCell sx={{ minWidth: 200 }} align="center">
                Active
              </TableCell>
              <TableCell sx={{ minWidth: 200 }} align="center">
                Code Review
              </TableCell>
              <TableCell sx={{ minWidth: 200 }} align="center">
                Ready for test
              </TableCell>
              <TableCell sx={{ minWidth: 200 }} align="center">
                Testing
              </TableCell>
              <TableCell sx={{ minWidth: 200 }} align="center">
                Closed
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </Box>
      <TreeView
        ref={treeview}
        aria-label="controlled"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        onNodeToggle={handleToggle}
        multiSelect
      >
        {filteredTaskBoard.map((user, i) => (
          <TreeItem
            sx={{ mt: 1, backgroundColor }}
            label={
              <div>
                <Typography style={treeViewStyle} variant="h5" my={2}>
                  {" "}
                  <Avatar
                    src="./user.svg"
                    sx={{ mt: 1, mr: 1, mb: 1, bgcolor: "#0079bf" }}
                  />
                  {user.Name}
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      event.stopPropagation(); // prevent the click event from propagating to the TreeItem
                      props.setTaskDialogOptions({
                        ...props.taskDialogOptions,
                        isCreating: true,
                        isOpen: true,
                        selectedTask: props.newTask,
                      }); // handle the click event for the button
                    }}
                    sx={{
                      mr: 2,
                      ml: "auto",
                    }}
                  >
                    Add new task
                  </Button>
                </Typography>{" "}
              </div>
            }
            nodeId={i.toString()}
            key={i}
          >
            <Table sx={{ ml: 9.5 }}>
              <TableBody>
                {user.result.map((value, j) => (
                  <TableRow
                    key={j}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 5,
                        borderColor,
                      },
                    }}
                  >
                    {value.map((cell, k) =>
                      !cell ? (
                        <TableCell
                          key={k + "empty"}
                          sx={{
                            "&:td": { border: 1 },
                          }}
                          style={cellStyle}
                        >
                          <div
                            style={{
                              width: 190,
                            }}
                          ></div>
                        </TableCell>
                      ) : (
                        <TableCell key={k + j} style={cellStyle}>
                          <Card
                            className={"cardref"}
                            sx={{
                              m: "auto",
                              width: 200,
                              display: "flex",
                              height: 265,
                            }}
                            onClick={() => {
                              handleTaskClick(cell);
                            }}
                          >
                            <Divider
                              variant="fullWidth"
                              orientation="vertical"
                              sx={
                                cell.IsBug === false
                                  ? {
                                      height: 265,
                                      bgcolor: "#f0bc34",
                                      width: 4,
                                    }
                                  : {
                                      height: 265,
                                      bgcolor: "#ff4f9b",
                                      width: 4,
                                    }
                              }
                            />
                            <CardActionArea>
                              <CardContent>
                                <Typography
                                  variant="body1"
                                  sx={{ display: "flex" }}
                                >
                                  {cell.IsBug === false ? (
                                    <img
                                      style={{
                                        verticalAlign: "text-top",
                                        marginRight: "2px",
                                      }}
                                      alt="clipboard"
                                      src={Clipboard}
                                      height="25px"
                                      width="25px"
                                    />
                                  ) : (
                                    <img
                                      style={{
                                        verticalAlign: "text-top",
                                        marginRight: "2px",
                                      }}
                                      alt="bug"
                                      src={Bug}
                                      height="25px"
                                      width="25px"
                                    />
                                  )}
                                  {cell.Title}
                                </Typography>
                                <Typography
                                  style={treeViewStyle}
                                  variant="subtitle1"
                                  my={0.3}
                                >
                                  <Avatar
                                    src="./user.svg"
                                    sx={{
                                      mt: 0.3,
                                      mr: 1,
                                      mb: 0.3,
                                      height: 30,
                                      width: 30,
                                      bgcolor: "#0079bf",
                                    }}
                                  />
                                  {user.Name}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  State: {cell.State}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Due date: {cell.DueDate}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Area Path: {cell.AreaPath}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Iteration: {cell.Iteration}
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TreeItem>
        ))}
      </TreeView>
      <TaskDialog
        isCreating={props.taskDialogOptions.isCreating}
        isOpen={props.taskDialogOptions.isOpen}
        handleClose={handleCloseDialog}
        selectedTask={props.taskDialogOptions.selectedTask}
        submit={handleSaveTask}
        setTasks={props.setTasks}
        handleDelete={handleDelete}
        tasks={props.tasks}
        setTaskDialogOptions={props.setTaskDialogOptions}
        isTask={true}
        userStories={props.userStories}
        users={props.users}
      />
    </Box>
  );
}

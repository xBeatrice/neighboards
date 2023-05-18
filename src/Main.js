import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Clipboard from "./clipboard.svg";
import Bug from "./bug.svg";
import TaskDialog from "./TaskDialog.js";
import { tasks as tasksMock } from "./mocks/taskBoardMock.js";
import { users } from "./mocks/usersMock.js";
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
  const newTask = {
    id: "",
    title: "",
    userId: "",
    state: "",
    isBug: false,
    iteration: "",
    dueDate: null,
    areaPath: "",
    description: "",
  };

  const [expanded, setExpanded] = React.useState([]);

  const [tasks, setTasks] = React.useState(tasksMock);

  const [taskDialogOptions, setTaskDialogOptions] = React.useState({
    isOpen: false,
    isCreating: false,
  });

  const [currentTaskBoard, setCurrentTaskBoard] = React.useState([]);

  const [filteredTaskBoard, setFilteredTaskBoard] = React.useState([]);

  const handleSaveTask = (updatedTask) => {
    if (taskDialogOptions.isCreating === true) {
      tasks.push(updatedTask);
    } else {
      setTasks((prevItems) =>
        prevItems.map((item) => {
          if (item.id === updatedTask.id) {
            return updatedTask;
          } else {
            return item;
          }
        })
      );
    }
    handleTaskClick(null);
  };

  const handleCloseDialog = () => {
    setTaskDialogOptions({
      ...taskDialogOptions,
      isCreating: false,
      isOpen: false,
    });
  };

  const handleTaskClick = (task) => {
    setTaskDialogOptions({
      ...taskDialogOptions,
      isCreating: false,
      isOpen: !!task,
      selectedTask: task,
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
    const taskBoard = users.map((user) => {
      var userTasks = tasks.filter((task) => task.userId === user.id);

      let result = [[], [], [], [], [], [], [], [], [], []];

      userTasks.forEach((t) => {
        for (let i = 0; i < states.length; i++) {
          if (t.state === states[i]) {
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
  }, [tasks, tasks.length]);

  React.useEffect(() => {
    let taskBoard = JSON.parse(JSON.stringify(currentTaskBoard));

    if (props.person && props.person !== "all") {
      taskBoard = taskBoard.filter((user) => user.name == props.person);
    }

    for (let i = 0; i < taskBoard.length; i++) {
      for (let j = 0; j < taskBoard[i].result.length; j++) {
        for (let k = 0; k < taskBoard[i].result[j].length; k++) {
          if (
            props.iteration &&
            props.iteration !== "all" &&
            taskBoard[i].result[j][k] &&
            taskBoard[i].result[j][k].iteration != props.iteration
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
  }, [props.iteration, props.person, currentTaskBoard]);

  const treeViewStyle = {
    display: "flex",
    alignItems: "center",
  };

  const cellStyle = {
    borderLeft: "4px solid white",
    borderRight: "4px solid white",
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 1, display: "flex" }}>
        <Button onClick={handleExpandClick} sx={{ minWidth: 150 }}>
          {expanded.length === 0 ? "Expand all" : "Collapse all"}
        </Button>
        <Table sx={{ ml: "auto", mr: "8%", mt: 1 }} size="small">
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
            sx={{ mt: 1, backgroundColor: "#e6e6e6" }}
            label={
              <div>
                <Typography style={treeViewStyle} variant="h5" my={2}>
                  {" "}
                  <Avatar
                    src="./user.svg"
                    sx={{ mt: 1, mr: 1, mb: 1, bgcolor: "#0079bf" }}
                  />
                  {user.name}
                  <Button
                    variant="contained"
                    onClick={(event) => {
                      event.stopPropagation(); // prevent the click event from propagating to the TreeItem
                      setTaskDialogOptions({
                        ...taskDialogOptions,
                        isCreating: true,
                        isOpen: true,
                        selectedTask: newTask,
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
            <Table sx={{ ml: 10.5 }}>
              <TableBody>
                {user.result.map((value, j) => (
                  <TableRow
                    key={j}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 10,
                        borderColor: "white",
                      },
                    }}
                  >
                    {value.map((cell, k) =>
                      !cell ? (
                        <TableCell
                          key={k + "empty"}
                          sx={{
                            minWidth: 200,
                            "&:td": { border: 1 },
                          }}
                          style={cellStyle}
                        ></TableCell>
                      ) : (
                        <TableCell
                          key={k + j}
                          sx={{ minWidth: 200 }}
                          style={cellStyle}
                        >
                          <Card
                            className={"cardref"}
                            sx={{
                              my: 1,
                              width: 200,
                              display: "flex",
                            }}
                            onClick={() => {
                              handleTaskClick(cell);
                            }}
                          >
                            <Divider
                              variant="fullWidth"
                              orientation="vertical"
                              sx={
                                cell.isBug === false
                                  ? {
                                      height: 240,
                                      bgcolor: "#f0bc34",
                                      width: 4,
                                    }
                                  : {
                                      height: 240,
                                      bgcolor: "#ff4f9b",
                                      width: 4,
                                    }
                              }
                            />
                            <CardActionArea>
                              <CardContent>
                                <Typography variant="h6">
                                  {cell.isBug === false ? (
                                    <img
                                      alt="clipboard"
                                      src={Clipboard}
                                      height="25px"
                                      width="25px"
                                      bgcolor="#f0bc34"
                                      sx={{ mr: 2 }}
                                    />
                                  ) : (
                                    <img
                                      alt="bug"
                                      src={Bug}
                                      height="25px"
                                      width="25px"
                                      sx={{ mr: 2 }}
                                    />
                                  )}
                                  {cell.title}
                                </Typography>
                                <Typography
                                  style={treeViewStyle}
                                  variant="subtitle1"
                                  my={2}
                                >
                                  <Avatar
                                    src="./user.svg"
                                    sx={{
                                      mt: 1,
                                      mr: 1,
                                      mb: 1,
                                      height: 30,
                                      width: 30,
                                      bgcolor: "#0079bf",
                                    }}
                                  />
                                  {user.name}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  State: {cell.state}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Due date: {cell.dueDate}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Area Path: {cell.areaPath}
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Iteration: {cell.iteration}
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
        isOpen={taskDialogOptions.isOpen}
        handleClose={handleCloseDialog}
        selectedTask={taskDialogOptions.selectedTask}
        submit={handleSaveTask}
        setTasks={setTasks}
      />
    </Box>
  );
}

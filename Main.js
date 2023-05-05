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
import { useRef, useState } from "react";

export default function Main() {
  const [expanded, setExpanded] = React.useState([]);

  const [taskDialog, setTaskDialog] = React.useState(false);

  const [selectedTask, setSelectedTask] = React.useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleClickOpen = () => {
    setTaskDialog(true);
  };

  const handleClose = () => {
    setTaskDialog(false);
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

  const users = [
    { id: "123", name: "maria" },
    { id: "345", name: "ioana" },
  ];

  const tasks = [
    // reactiv
    { title: "aaaa", userId: "123", state: "active", isBug: false },
    { title: "bbb", userId: "123", state: "active", isBug: true },
    { title: "yyy", userId: "345", state: "codeReview", isBug: false },
    { title: "nnnn", userId: "123", state: "testing", isBug: true },
  ];

  const states = [
    "notStarted",
    "active",
    "codeReview",
    "readyForTest",
    "testing",
    "closed",
  ];

  const taskBoardMock = {
    users: [
      {
        id: "123",
        name: "maria",
        tasks: [
          [
            {},
            { title: "aaaa", userId: "123", state: "active" },
            { title: "yyy", userId: "345", state: "codeReview" },
            {},
            { title: "nnnn", userId: "123", state: "testing" },
            {},
          ],
          [{}, {}, {}, {}, {}, {}],
          [{}, {}, {}, {}, {}, {}],
        ],
      },
    ],
  };

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
          result[index][i] = { title: t.title, state: t.state, isBug: t.isBug };
          result[index].length = 6;
        }
      }
    });

    for (let i = 0; i < result.length; i++) {
      result[i] = [...result[i]];
    }
    return { ...user, result };
  });

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
        {taskBoard.map((user, i) => (
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
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 10,
                        borderColor: "white",
                      },
                    }}
                  >
                    {value.map((cell, k) =>
                      cell === undefined ? (
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
                              handleClickOpen();
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
                                  Due date:
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Area Path:
                                </Typography>
                                <Typography variant="body1" color="gray">
                                  Iteration:
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
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        taskDialog={taskDialog}
        selectedTask={selectedTask}
      />
    </Box>
  );
}

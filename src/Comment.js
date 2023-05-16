import * as React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function Comment(props) {
  return (
    <div>
      {props.currentTask.comments
        ? props.currentTask.comments.map((c, index) => (
            <Card
              key={index}
              sx={{
                width: 720,
                my: 4,
                mx: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              <CardContent>
                <Typography variant="body1">{c}</Typography>
              </CardContent>
            </Card>
          ))
        : null}
    </div>
  );
}

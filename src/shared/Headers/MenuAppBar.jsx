import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid2, Stack } from "@mui/material";



export default function MenuAppBar({ title = 'title', goBack, children }) {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Stack direction={"row"} alignItems={"center"}>
                <IconButton
                  onClick={goBack}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title || "Title"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {children}
            </Box>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

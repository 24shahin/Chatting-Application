import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import User from "../components/User";
import FriendRequest from "../components/FriendRequest";
import Friends from "../components/Friends";
import BlockList from "../components/BlockList";

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100vh",
            rowGap: "20px",
            margin: "0",
          }}
        >
          <Friends />
          <BlockList />
        </Grid>
        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100vh",
            rowGap: "20px",
            margin: "0",
          }}
        >
          <User />
          <FriendRequest />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;

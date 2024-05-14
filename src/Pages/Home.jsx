import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import User from "../components/User";
import BlockList from "../components/BlockList";
import Friends from "../components/Friends";
import MyGroups from "../components/MyGroups";
import GroupsList from "../components/GroupsList";
import FriendRequest from "../components/FriendRequest";

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100vh",
            rowGap: "20px",
            margin: "0",
          }}
        >
          <GroupsList />
          <FriendRequest />
        </Grid>
        <Grid
          item
          xs={4}
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
          <MyGroups />
        </Grid>
        <Grid
          item
          xs={4}
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
          <BlockList />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
